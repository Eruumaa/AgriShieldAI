import json
import os
from typing import Dict, List, Optional

import joblib
import pandas as pd
from fastapi import HTTPException

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ARTIFACT_DIR = os.path.join(ROOT_DIR, 'modelML', 'artifacts')
DATA_DIR = os.path.join(ROOT_DIR, 'Data', 'processed')
FSRI_FILE = os.path.join(DATA_DIR, 'fsri_dataset.csv')

CLASSIFIER_NAME = 'LightGBM'
REGRESSOR_NAME = 'LightGBMRegressor'


def _load_artifact(filename: str):
    path = os.path.join(ARTIFACT_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f'Artifact not found: {path}')
    return joblib.load(path)


try:
    classifier_pipeline = _load_artifact(f'{CLASSIFIER_NAME}.pkl')
except Exception as exc:
    classifier_pipeline = None
    classifier_error = exc
else:
    classifier_error = None

try:
    regressor_pipeline = _load_artifact(f'{REGRESSOR_NAME}.pkl')
except Exception as exc:
    regressor_pipeline = None
    regressor_error = exc
else:
    regressor_error = None

try:
    label_encoder = _load_artifact('label_encoder.pkl')
except Exception as exc:
    label_encoder = None
    label_encoder_error = exc
else:
    label_encoder_error = None

try:
    with open(os.path.join(ARTIFACT_DIR, 'feature_list.json'), 'r', encoding='utf-8') as f:
        FEATURE_LIST = json.load(f)
except Exception as exc:
    FEATURE_LIST = []
    feature_list_error = exc
else:
    feature_list_error = None

try:
    fsri_df = pd.read_csv(FSRI_FILE)
except Exception as exc:
    fsri_df = pd.DataFrame()
    fsri_error = exc
else:
    fsri_error = None


class ModelServiceError(Exception):
    pass


def _validate_artifacts() -> None:
    if classifier_pipeline is None:
        raise ModelServiceError(f'Classifier pipeline failed to load: {classifier_error}')
    if regressor_pipeline is None:
        raise ModelServiceError(f'Regressor pipeline failed to load: {regressor_error}')
    if label_encoder is None:
        raise ModelServiceError(f'Label encoder failed to load: {label_encoder_error}')
    if FEATURE_LIST is None or len(FEATURE_LIST) == 0:
        raise ModelServiceError(f'Feature list failed to load: {feature_list_error}')
    if fsri_df.empty:
        raise ModelServiceError(f'FSRI dataset failed to load: {fsri_error}')


def _build_input_dataframe(features: Dict[str, float]) -> pd.DataFrame:
    missing = [f for f in FEATURE_LIST if f not in features]
    if missing:
        raise ValueError(f'Missing feature values for: {missing}')
    extras = [f for f in features if f not in FEATURE_LIST]
    if extras:
        raise ValueError(f'Unexpected feature names: {extras}')

    df = pd.DataFrame([features], columns=FEATURE_LIST)
    try:
        df = df.astype(float)
    except ValueError as exc:
        raise ValueError(f'Feature values must be numeric: {exc}') from exc
    return df


def predict_fsri_category(features: Dict[str, float]) -> Dict[str, object]:
    _validate_artifacts()
    X = _build_input_dataframe(features)
    category_index = classifier_pipeline.predict(X)[0]
    category_label = label_encoder.inverse_transform([category_index])[0]
    prediction: Dict[str, object] = {'FSRI_Category': category_label}

    if hasattr(classifier_pipeline, 'predict_proba'):
        proba = classifier_pipeline.predict_proba(X)[0]
        prediction['FSRI_Category_Probabilities'] = {
            str(cls): float(score)
            for cls, score in zip(label_encoder.classes_, proba)
        }
    return prediction


def predict_fsri_value(features: Dict[str, float]) -> Dict[str, float]:
    _validate_artifacts()
    X = _build_input_dataframe(features)
    y_pred = regressor_pipeline.predict(X)[0]
    return {'FSRI': float(y_pred)}


def get_global_dashboard_summary() -> Dict[str, object]:
    if fsri_df.empty:
        raise ModelServiceError(f'FSRI dataset failed to load: {fsri_error}')

    summary = {
        'countries': int(fsri_df['Country'].nunique()) if 'Country' in fsri_df.columns else 0,
        'years': sorted(fsri_df['Year'].dropna().unique().tolist()) if 'Year' in fsri_df.columns else [],
        'average_fsri': float(fsri_df['FSRI'].mean()) if 'FSRI' in fsri_df.columns else None,
        'category_counts': fsri_df['FSRI_Category'].value_counts().to_dict() if 'FSRI_Category' in fsri_df.columns else {}
    }
    return summary


def get_country_dashboard_data(country: str) -> Dict[str, object]:
    if fsri_df.empty:
        raise ModelServiceError(f'FSRI dataset failed to load: {fsri_error}')
    if 'Country' not in fsri_df.columns:
        raise ModelServiceError('FSRI dataset does not contain Country column')

    country_data = fsri_df[fsri_df['Country'].str.lower() == country.lower()].copy()
    if country_data.empty:
        raise HTTPException(status_code=404, detail=f'Country not found: {country}')

    if 'Year' in country_data.columns:
        country_data = country_data.sort_values('Year')

    rows = country_data.to_dict(orient='records')
    return {
        'country': country,
        'record_count': len(rows),
        'records': rows
    }


def get_feature_list() -> List[str]:
    return FEATURE_LIST.copy()
