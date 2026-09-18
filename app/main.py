# FastAPI Backend

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI-Assisted Software Engineering Analytics API",
    description="API for AI coding agent classification and repository popularity prediction",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI-Assisted Software Engineering Analytics API is running"
    }


# Load trained models and preprocessing artifacts

import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

# Classification model
xgb_model = joblib.load(MODEL_DIR / "xgb_final.pkl")
label_encoder = joblib.load(MODEL_DIR / "label_encoder_final.pkl")

# Classification preprocessing
p1_title_vectorizer = joblib.load(MODEL_DIR / "p1_title_vectorizer.pkl")
p1_body_vectorizer = joblib.load(MODEL_DIR / "p1_body_vectorizer.pkl")
p1_encoder = joblib.load(MODEL_DIR / "p1_encoder.pkl")
p1_imputer = joblib.load(MODEL_DIR / "p1_imputer.pkl")
p1_scaler = joblib.load(MODEL_DIR / "p1_scaler.pkl")

# Regression model
knn_model = joblib.load(MODEL_DIR / "knn_final.pkl")

# Regression preprocessing
p2_encoder = joblib.load(MODEL_DIR / "p2_encoder.pkl")
p2_imputer = joblib.load(MODEL_DIR / "p2_imputer.pkl")
p2_scaler = joblib.load(MODEL_DIR / "p2_scaler.pkl")

print("All models and preprocessing artifacts loaded successfully.")


# Classification Request Schema

from pydantic import BaseModel
from datetime import datetime
import numpy as np
import pandas as pd
from scipy.sparse import hstack, csr_matrix


class AgentPredictionRequest(BaseModel):
    title: str
    body: str
    language: str
    forks: float
    stars: float
    is_forked: bool
    followers: float
    following: float
    created_at: datetime
    user_created_at: datetime


@app.post("/predict/agent")
def predict_agent(request: AgentPredictionRequest):

    # Create input DataFrame
    input_data = pd.DataFrame([{
        "title": request.title,
        "body": request.body,
        "language": request.language,
        "forks": request.forks,
        "stars": request.stars,
        "is_forked": request.is_forked,
        "followers": request.followers,
        "following": request.following,
        "created_at": request.created_at,
        "user_created_at": request.user_created_at
    }])

    # Create engineered features
    input_data["title_length"] = input_data["title"].str.len()
    input_data["body_length"] = input_data["body"].str.len()

    input_data["created_year"] = input_data["created_at"].dt.year
    input_data["created_month"] = input_data["created_at"].dt.month
    input_data["created_dayofweek"] = input_data["created_at"].dt.dayofweek
    input_data["created_hour"] = input_data["created_at"].dt.hour

    input_data["user_account_age_days"] = (
        input_data["created_at"] -
        input_data["user_created_at"]
    ).dt.days

    # Separate categorical features
    categorical_features = input_data[
        [
            "language",
            "is_forked"
        ]
    ].copy()

    # Match the representation used during training
    categorical_features["is_forked"] = (
        categorical_features["is_forked"]
        .map({
            False: "0.0",
            True: "1.0"
        })
    )

    # Separate numerical features
    numerical_features = input_data[
        [
            "forks",
            "stars",
            "followers",
            "following",
            "user_account_age_days",
            "title_length",
            "body_length",
            "created_year",
            "created_month",
            "created_dayofweek",
            "created_hour"
        ]
    ]

    # TF-IDF transformation
    title_tfidf = p1_title_vectorizer.transform(
        input_data["title"]
    )

    body_tfidf = p1_body_vectorizer.transform(
        input_data["body"]
    )

    # Categorical encoding
    encoded_features = p1_encoder.transform(
        categorical_features
    )

    # Numerical imputation and scaling
    imputed_features = p1_imputer.transform(
        numerical_features
    )

    scaled_features = p1_scaler.transform(
        imputed_features
    )

    # Build final feature matrix
    X_input = hstack([
        title_tfidf,
        body_tfidf,
        encoded_features,
        csr_matrix(scaled_features)
    ]).tocsr().astype("float32")

    # Generate prediction
    prediction_encoded = xgb_model.predict(X_input)

    # Convert encoded prediction back to agent name
    predicted_agent = label_encoder.inverse_transform(
        prediction_encoded.astype(int)
    )[0]

    return {
        "predicted_agent": predicted_agent
    }


# Regression Request Schema

class StarsPredictionRequest(BaseModel):
    license: str
    is_forked: bool
    language: str
    forks: float
    repository_name_length: int
    repository_owner: str
    repository_name: str


@app.post("/predict/stars")
def predict_stars(request: StarsPredictionRequest):

    # Create input DataFrame
    input_data = pd.DataFrame([{
        "license": request.license,
        "is_forked": request.is_forked,
        "language": request.language,
        "forks": request.forks,
        "repository_name_length": request.repository_name_length,
        "repository_owner": request.repository_owner,
        "repository_name": request.repository_name
    }])

    # Separate categorical features
    categorical_features = input_data[
        [
            "license",
            "language",
            "is_forked",
            "repository_owner",
            "repository_name"
        ]
    ].copy()

    # Match the representation used during training
    categorical_features["is_forked"] = (
        categorical_features["is_forked"]
        .map({
            False: "0",
            True: "1"
        })
    )

    # Separate numerical features
    numerical_features = input_data[
        [
            "forks",
            "repository_name_length"
        ]
    ]

    # Encode categorical features
    encoded_features = p2_encoder.transform(
        categorical_features
    )

    # Impute and scale numerical features
    imputed_features = p2_imputer.transform(
        numerical_features
    )

    scaled_features = p2_scaler.transform(
        imputed_features
    )

    # Build final feature matrix
    X_input = hstack([
        encoded_features,
        csr_matrix(scaled_features)
    ]).tocsr().astype("float32")

    # Generate prediction
    predicted_stars = knn_model.predict(X_input)[0]

    return {
        "predicted_stars": round(float(predicted_stars), 2)
    }

