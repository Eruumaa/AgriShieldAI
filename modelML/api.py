import os
from typing import Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from modelML.dashboard_model import (
    get_country_dashboard_data,
    get_feature_list,
    get_global_dashboard_summary,
    predict_fsri_category,
    predict_fsri_value,
    ModelServiceError,
)

app = FastAPI(
    title='AgriShield AI Dashboard Model API',
    description='Serve FSRI predictions and dashboard summaries for the AgriShield AI frontend.',
    version='0.1.0'
)


class PredictionPayload(BaseModel):
    features: Dict[str, float]
    output: str = 'both'


class PredictionResponse(BaseModel):
    FSRI_Category: str
    FSRI: float
    FSRI_Category_Probabilities: Dict[str, float]


@app.get('/health')
def health_check():
    return {'status': 'ok', 'selected_model': 'LightGBM classifier + LightGBM regressor'}


@app.get('/dashboard/global')
def dashboard_global():
    try:
        return get_global_dashboard_summary()
    except ModelServiceError as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get('/dashboard/country/{country}')
def dashboard_country(country: str):
    try:
        return get_country_dashboard_data(country)
    except ModelServiceError as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get('/dashboard/features')
def dashboard_features():
    return {'feature_list': get_feature_list()}


@app.post('/prediction')
def prediction(payload: PredictionPayload):
    try:
        category_result = predict_fsri_category(payload.features)
        value_result = predict_fsri_value(payload.features)
    except ModelServiceError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    response = {
        'FSRI_Category': category_result['FSRI_Category'],
        'FSRI': value_result['FSRI'],
        'FSRI_Category_Probabilities': category_result.get('FSRI_Category_Probabilities', {})
    }
    return response


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('modelML.api:app', host='127.0.0.1', port=8000, reload=False)
