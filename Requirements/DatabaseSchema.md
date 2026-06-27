DatabaseSchema.md

# Database Schema

Database

PostgreSQL

---

## users

| Field | Type |
|---------|---------|
| id | UUID |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| created_at | TIMESTAMP |

---

## countries

| Field | Type |
|---------|---------|
| id | SERIAL |
| iso_code | VARCHAR |
| country_name | VARCHAR |
| region | VARCHAR |
| population | BIGINT |

---

## commodities

| Field | Type |
|---------|---------|
| id | SERIAL |
| commodity_name | VARCHAR |
| category | VARCHAR |

---

## faostat_data

| Field | Type |
|---------|---------|
| id | BIGSERIAL |
| country_id | FK |
| commodity_id | FK |
| year | INT |
| production | FLOAT |
| import | FLOAT |
| export | FLOAT |
| consumption | FLOAT |
| food_supply | FLOAT |
| agricultural_land | FLOAT |
| fertilizer_use | FLOAT |

---

## engineered_features

| Field | Type |
|---------|---------|
| id | BIGSERIAL |
| faostat_id | FK |
| import_dependency_ratio | FLOAT |
| self_sufficiency_ratio | FLOAT |
| production_growth | FLOAT |
| food_availability | FLOAT |
| land_productivity | FLOAT |

---

## model_predictions

| Field | Type |
|---------|---------|
| id | UUID |
| country_id | FK |
| prediction_year | INT |
| risk_score | FLOAT |
| risk_level | VARCHAR |
| confidence | FLOAT |
| model_name | VARCHAR |
| created_at | TIMESTAMP |

---

## shap_values

| Field | Type |
|---------|---------|
| id | BIGSERIAL |
| prediction_id | FK |
| feature_name | VARCHAR |
| importance | FLOAT |

---

## recommendations

| Field | Type |
|---------|---------|
| id | UUID |
| prediction_id | FK |
| recommendation | TEXT |
| expected_impact | TEXT |

---

## reports

| Field | Type |
|---------|---------|
| id | UUID |
| user_id | FK |
| report_name | VARCHAR |
| report_type | VARCHAR |
| generated_at | TIMESTAMP |

---

# Relationships

users

↓

reports

countries

↓

faostat_data

↓

engineered_features

↓

model_predictions

↓

recommendations

↓

shap_values

commodities

↓

faostat_data

---

# ER Diagram

```

Users
|
|------ Reports

Countries
|
|------ FAOSTAT Data ------ Commodities
|
|------ Engineered Features
|
|------ Model Predictions
|
|------ SHAP Values
|
|------ Recommendations

```
