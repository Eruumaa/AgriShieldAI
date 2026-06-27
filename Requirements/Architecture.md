Architecture.md

# AgriShield AI Architecture

## Architecture Style

Microservice Ready Architecture

```
                +-----------------------+
                |      Frontend         |
                |  Streamlit / React    |
                +-----------+-----------+
                            |
                            |
                    REST API
                            |
            +---------------+----------------+
            |                                |
     FastAPI Backend                  Authentication
            |
    +-------+-----------------------------+
    |                                     |
Prediction Engine                 Dashboard Service
    |                                     |
Recommendation Engine           Analytics Service
    |
Explainable AI
    |
Machine Learning Model
    |
Feature Engineering
    |
Data Warehouse
    |
FAOSTAT Dataset
```

---

## Layer 1

Presentation Layer

- Dashboard
- Maps
- Charts
- Reports

---

## Layer 2

Application Layer

- REST API
- Authentication
- Prediction Service
- Recommendation Service

---

## Layer 3

AI Layer

Machine Learning

- Random Forest
- XGBoost
- LightGBM

Explainable AI

- SHAP

---

## Layer 4

Data Layer

Raw Dataset

↓

Cleaning

↓

Feature Engineering

↓

Training Dataset

↓

Prediction Dataset

---

## Layer 5

Storage

SQLite

Development

↓

PostgreSQL

Production

---

## Technology Stack

Backend

FastAPI

Frontend

Streamlit

Machine Learning

Scikit-learn

Visualization

Plotly

Database

PostgreSQL

ORM

SQLAlchemy

Deployment

Docker