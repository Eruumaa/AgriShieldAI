RequirementModelMachineLearning.md

# Requirement Document

## AgriShield AI

### Module : Machine Learning

---

# 1. Objective

Mengembangkan model Explainable Machine Learning yang mampu memprediksi tingkat Food Security Risk.

---

# 2. Input

feature_dataset.csv

---

# 3. Prediction Target

Food Security Risk Index

atau

Food Security Category

Very Safe

Safe

Medium

High Risk

Critical

---

# 4. Machine Learning Models

Minimum:

- Logistic Regression
- Random Forest
- XGBoost
- LightGBM
- CatBoost

Optional

Neural Network

LSTM

Temporal Fusion Transformer

---

# 5. Training Pipeline

Train

Validation

Test

Cross Validation

Hyperparameter Optimization

---

# 6. Evaluation

Regression

MAE

RMSE

R²

Classification

Accuracy

Precision

Recall

F1 Score

ROC AUC

Confusion Matrix

---

# 7. Explainable AI

Mandatory

SHAP

Output:

Feature Importance

Waterfall Plot

Force Plot

Summary Plot

Dependence Plot

---

# 8. Recommendation Engine

Model harus menghasilkan rekomendasi.

Example

Risk High

↓

Increase Production

↓

Increase Fertilizer

↓

Reduce Export

↓

Increase Import

---

# 9. Forecast

Prediksi

2026

2027

2028

2029

2030

---

# 10. Model Deployment

Export:

model.pkl

preprocessor.pkl

feature_list.json

label_encoder.pkl

---

# 11. Performance Requirement

Accuracy

>90%

Prediction Time

<1 second

Explainability

100%

---

# 12. Deliverables

trained_model.pkl

evaluation_report.pdf

feature_importance.csv

shap_values.pkl

recommendation_engine.json