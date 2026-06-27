/**
 * AgriShield AI — Supabase Data Seeder
 *
 * Reads the processed CSV files and inserts them into Supabase tables.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in your Supabase credentials
 *   2. Run: node supabase/seed_data.js
 *
 * Prerequisites:
 *   - Run supabase_schema.sql in the Supabase SQL Editor first
 *   - npm install @supabase/supabase-js csv-parse dotenv
 */

import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const DATA_DIR = path.join(__dirname, '..', '..', 'Data', 'processed');

async function seedTable(tableName, csvFile, columnMap) {
  const filePath = path.join(DATA_DIR, csvFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return;
  }

  console.log(`📦 Seeding ${tableName} from ${csvFile}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });

  const rows = records.map(record => {
    const row = {};
    for (const [dbCol, csvCol] of Object.entries(columnMap)) {
      const value = record[csvCol];
      row[dbCol] = value === '' || value === undefined ? null : isNaN(Number(value)) ? value : Number(value);
    }
    return row;
  });

  // Insert in batches of 500
  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(tableName).insert(batch);
    if (error) {
      console.error(`❌ Error inserting into ${tableName} (batch ${i / BATCH_SIZE + 1}):`, error.message);
      return;
    }
    inserted += batch.length;
  }
  console.log(`✅ Inserted ${inserted} rows into ${tableName}`);
}

async function main() {
  console.log('\n🌾 AgriShield AI — Supabase Data Seeder\n');

  // Seed FSRI data
  await seedTable('fsri_data', 'fsri_dataset.csv', {
    country: 'Country',
    year: 'Year',
    production: 'Production',
    population: 'Population',
    food_availability_index: 'Food_Availability_Index',
    self_sufficiency_ratio: 'Self_Sufficiency_Ratio',
    production_stability_index: 'Production_Stability_Index',
    fsri: 'FSRI',
    fsri_category: 'FSRI_Category',
  });

  // Seed clean data
  await seedTable('clean_data', 'clean_dataset.csv', {
    country: 'Country',
    year: 'Year',
    production: 'Production',
    imports: 'Imports',
    exports: 'Exports',
    population: 'Population',
    land_area: 'Land_Area',
    fertilizer: 'Fertilizer',
  });

  // Seed feature data
  await seedTable('feature_data', 'feature_dataset.csv', {
    country: 'Country',
    year: 'Year',
    production: 'Production',
    exports: 'Exports',
    imports: 'Imports',
    population: 'Population',
    land_area: 'Land_Area',
    fertilizer: 'Fertilizer',
    import_dependency_ratio: 'Import_Dependency_Ratio',
    export_ratio: 'Export_Ratio',
    food_availability_index: 'Food_Availability_Index',
    agricultural_productivity: 'Agricultural_Productivity',
    production_growth: 'Production_Growth',
    consumption_growth: 'Consumption_Growth',
    self_sufficiency_ratio: 'Self_Sufficiency_Ratio',
    yield_growth: 'Yield_Growth',
    production_stability_index: 'Production_Stability_Index',
    climate_risk_index: 'Climate_Risk_Index',
    fertilizer_efficiency: 'Fertilizer_Efficiency',
    trade_balance_index: 'Trade_Balance_Index',
  });

  console.log('\n🎉 Seeding complete!\n');
}

main().catch(console.error);
