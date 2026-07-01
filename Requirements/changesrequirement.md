# Requirements for Updating AgriShield AI Datasets

This document provides context and step-by-step instructions for updating the datasets used by the AgriShield AI model and web dashboard. 

---

## 📌 Context
AgriShield AI is a machine learning dashboard designed to predict the **FSRI (Food Security & Resiliency Index)**.
* **Currently configured data path:** `Data/processed/fsri_dataset.csv` (and related datasets: `clean_dataset.csv`, `feature_dataset.csv`).
* **Machine Learning Model:** Under `modelML/artifacts/`, there are pre-trained LightGBM classifier and regressor pipelines that rely on a specific feature structure.
* **Data Processing Logic:** The existing data processing and feature engineering logic is defined inside the Jupyter Notebook: `Dataprocessing/dataProcessing.ipynb`.

---

## 🎯 Objective
Process the new raw data files provided in the `NewData` folder, run them through the processing pipeline, and generate the updated datasets in the `DatasetNew` folder.

---

## 📂 Directories and Inputs
1. **Raw Inputs Folder:** `NewData/` (will be populated with new raw CSV files from sources like FAOSTAT).
2. **Output Target Folder:** `DatasetNew/`
3. **Reference Data & Configs:**
   * Old Processed Files: [Data/processed/](file:///c:/Users/akilm/Documents/UTU/Data/processed/)
   * Model Feature List: [feature_list.json](file:///c:/Users/akilm/Documents/UTU/modelML/artifacts/feature_list.json)
   * Original Preprocessing Steps: [dataProcessing.ipynb](file:///c:/Users/akilm/Documents/UTU/Dataprocessing/dataProcessing.ipynb)

---

## 📋 Step-by-Step Task Requirements

### 1. Analysis of Preprocessing Code
* Read the notebook [dataProcessing.ipynb](file:///c:/Users/akilm/Documents/UTU/Dataprocessing/dataProcessing.ipynb) to understand how the raw inputs are cleaned, merged, and transformed to produce:
  * `clean_dataset.csv`
  * `feature_dataset.csv`
  * `fsri_dataset.csv`

### 2. Feature Schema & Column Integrity (CRITICAL)
* The ML models require a strict set of columns defined in [feature_list.json](file:///c:/Users/akilm/Documents/UTU/modelML/artifacts/feature_list.json).
* You must ensure the final processed files in `DatasetNew/` contain the exact same column names, data types, and scaling/transformations as the original processed files, so that the pre-trained LightGBM models (`LightGBM.pkl` and `LightGBMRegressor.pkl`) can make predictions without errors.

### 3. Execution & Generation of Output
* Read the raw CSVs from the `NewData/` directory.
* Apply the processing, cleaning, and feature engineering rules.
* Output the three processed files to the `DatasetNew/` directory:
  1. `DatasetNew/clean_dataset.csv`
  2. `DatasetNew/feature_dataset.csv`
  3. `DatasetNew/fsri_dataset.csv`

### 4. Validation
* Compare the headers of the newly generated files in `DatasetNew/` with the original files in `Data/processed/` to ensure 100% compatibility.
* Verify that there are no NaN values in fields expected by the model.

---

## 🚀 Post-Generation Integration (Optional reference for User)
After successfully generating the files in `DatasetNew/`:
1. Back up the old `Data/processed/` directory.
2. Copy the files from `DatasetNew/` into `Data/processed/`.
3. Restart the FastAPI backend (`python -m modelML.api`) to serve the new data.
