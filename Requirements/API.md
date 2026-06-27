API.md

# AgriShield AI REST API Documentation

## Overview

AgriShield AI provides RESTful APIs to serve machine learning predictions,
food security analytics, recommendation engine, and dashboard data.

Base URL

https://api.agrishield.ai/v1/

---

# Authentication

JWT Bearer Token

Authorization:
Bearer <access_token>

---

# Modules

- Authentication
- Country Analytics
- Commodity Analytics
- Prediction
- Explainable AI
- Recommendation
- Dashboard
- Report Generator

---

# Authentication

POST /auth/login

Body

{
    "email":"admin@agrishield.ai",
    "password":"password"
}

Response

{
    "access_token":"..."
}

---

POST /auth/register

---

# Country API

GET /countries

Response

[
    {
        "id":1,
        "country":"Indonesia"
    }
]

---

GET /countries/{id}

Response

{
    "country":"Indonesia",
    "population":278000000,
    "risk_score":22,
    "status":"Low"
}

---

# Commodity API

GET /commodities

GET /commodities/{id}

Response

{
    "commodity":"Rice",
    "production":56000000,
    "forecast":59000000,
    "trend":"Increasing"
}

---

# Prediction API

POST /prediction

Input

{
    "country":"Indonesia",
    "year":2028
}

Output

{
    "risk_score":18.7,
    "risk_level":"LOW",
    "confidence":0.94
}

---

# Explainable AI

GET /prediction/explain/{prediction_id}

Response

{
    "Top Features":[
        {
            "feature":"Rice Production",
            "importance":0.33
        },
        {
            "feature":"Population",
            "importance":0.25
        }
    ]
}

---

# Recommendation API

GET /recommendation/{country}

Response

{
    "recommendation":[
        "Increase rice production",
        "Reduce import dependency",
        "Expand irrigation"
    ]
}

---

# Dashboard API

GET /dashboard/global

GET /dashboard/country/{country}

GET /dashboard/commodity/{commodity}

---

# Report API

POST /report/pdf

Generate analytics report

Output

PDF File