-- ============================================================
-- AgriShield AI — Supabase Database Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────
-- Users
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'researcher',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────
-- Countries
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  iso_code VARCHAR(3),
  country_name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  population BIGINT
);

CREATE INDEX idx_countries_name ON countries(country_name);

-- ──────────────────────────────────────
-- Commodities
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS commodities (
  id SERIAL PRIMARY KEY,
  commodity_name VARCHAR(255) NOT NULL,
  category VARCHAR(100)
);

-- ──────────────────────────────────────
-- FAOSTAT Data
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS faostat_data (
  id BIGSERIAL PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  commodity_id INT REFERENCES commodities(id) ON DELETE SET NULL,
  year INT NOT NULL,
  production DOUBLE PRECISION,
  import DOUBLE PRECISION,
  export DOUBLE PRECISION,
  consumption DOUBLE PRECISION,
  food_supply DOUBLE PRECISION,
  agricultural_land DOUBLE PRECISION,
  fertilizer_use DOUBLE PRECISION
);

CREATE INDEX idx_faostat_country_year ON faostat_data(country_id, year);

-- ──────────────────────────────────────
-- Engineered Features
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS engineered_features (
  id BIGSERIAL PRIMARY KEY,
  faostat_id BIGINT REFERENCES faostat_data(id) ON DELETE CASCADE,
  import_dependency_ratio DOUBLE PRECISION,
  self_sufficiency_ratio DOUBLE PRECISION,
  production_growth DOUBLE PRECISION,
  food_availability DOUBLE PRECISION,
  land_productivity DOUBLE PRECISION
);

-- ──────────────────────────────────────
-- Model Predictions
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS model_predictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_id INT REFERENCES countries(id) ON DELETE CASCADE,
  prediction_year INT NOT NULL,
  risk_score DOUBLE PRECISION,
  risk_level VARCHAR(50),
  confidence DOUBLE PRECISION,
  model_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_country ON model_predictions(country_id);

-- ──────────────────────────────────────
-- SHAP Values
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS shap_values (
  id BIGSERIAL PRIMARY KEY,
  prediction_id UUID REFERENCES model_predictions(id) ON DELETE CASCADE,
  feature_name VARCHAR(255),
  importance DOUBLE PRECISION
);

-- ──────────────────────────────────────
-- Recommendations
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prediction_id UUID REFERENCES model_predictions(id) ON DELETE CASCADE,
  recommendation TEXT,
  expected_impact TEXT
);

-- ──────────────────────────────────────
-- Reports
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  report_name VARCHAR(255),
  report_type VARCHAR(50),
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────
-- Flat tables for dashboard queries
-- (denormalized for fast reads)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS fsri_data (
  id BIGSERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  production DOUBLE PRECISION,
  population DOUBLE PRECISION,
  food_availability_index DOUBLE PRECISION,
  self_sufficiency_ratio DOUBLE PRECISION,
  production_stability_index DOUBLE PRECISION,
  fsri DOUBLE PRECISION,
  fsri_category VARCHAR(50)
);

CREATE INDEX idx_fsri_country ON fsri_data(country);
CREATE INDEX idx_fsri_year ON fsri_data(year);

CREATE TABLE IF NOT EXISTS clean_data (
  id BIGSERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  production DOUBLE PRECISION,
  imports DOUBLE PRECISION,
  exports DOUBLE PRECISION,
  population DOUBLE PRECISION,
  land_area DOUBLE PRECISION,
  fertilizer DOUBLE PRECISION
);

CREATE INDEX idx_clean_country ON clean_data(country);

CREATE TABLE IF NOT EXISTS feature_data (
  id BIGSERIAL PRIMARY KEY,
  country VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  production DOUBLE PRECISION,
  exports DOUBLE PRECISION,
  imports DOUBLE PRECISION,
  population DOUBLE PRECISION,
  land_area DOUBLE PRECISION,
  fertilizer DOUBLE PRECISION,
  import_dependency_ratio DOUBLE PRECISION,
  export_ratio DOUBLE PRECISION,
  food_availability_index DOUBLE PRECISION,
  agricultural_productivity DOUBLE PRECISION,
  production_growth DOUBLE PRECISION,
  consumption_growth DOUBLE PRECISION,
  self_sufficiency_ratio DOUBLE PRECISION,
  yield_growth DOUBLE PRECISION,
  production_stability_index DOUBLE PRECISION,
  climate_risk_index DOUBLE PRECISION,
  fertilizer_efficiency DOUBLE PRECISION,
  trade_balance_index DOUBLE PRECISION
);

-- ──────────────────────────────────────
-- Row Level Security (public read)
-- ──────────────────────────────────────
ALTER TABLE fsri_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE clean_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read fsri_data" ON fsri_data FOR SELECT USING (true);
CREATE POLICY "Public read clean_data" ON clean_data FOR SELECT USING (true);
CREATE POLICY "Public read feature_data" ON feature_data FOR SELECT USING (true);
CREATE POLICY "Public read countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read commodities" ON commodities FOR SELECT USING (true);
