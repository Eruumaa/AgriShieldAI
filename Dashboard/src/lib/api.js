import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockData } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/* ────────────────────────────────────────
   Helper: Fetch from FastAPI backend
   ──────────────────────────────────────── */
async function apiFetch(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────
   Dashboard Data API
   Uses Supabase if configured, otherwise
   falls back to embedded mock data.
   ──────────────────────────────────────── */

export async function fetchGlobalSummary() {
  // Try FastAPI first
  const apiData = await apiFetch('/dashboard/global');
  if (apiData) return apiData;

  // Try Supabase
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('fsri_data').select('*');
    if (data && data.length > 0) {
      const countries = new Set(data.map(r => r.country));
      const avgFsri = data.reduce((s, r) => s + r.fsri, 0) / data.length;
      const categories = {};
      data.forEach(r => { categories[r.fsri_category] = (categories[r.fsri_category] || 0) + 1; });
      return { countries: countries.size, average_fsri: avgFsri, category_counts: categories, years: [...new Set(data.map(r => r.year))].sort() };
    }
  }

  // Fallback to mock data
  return mockData.globalSummary;
}

export async function fetchCountries() {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('countries').select('*').order('country_name');
    if (data) return data;
  }
  return mockData.countries;
}

export async function fetchCountryData(country) {
  // Try FastAPI
  const apiData = await apiFetch(`/dashboard/country/${encodeURIComponent(country)}`);
  if (apiData) return apiData;

  // Try Supabase
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('fsri_data').select('*').ilike('country', country).order('year');
    if (data && data.length > 0) return { country, record_count: data.length, records: data };
  }

  // Mock fallback
  const records = mockData.fsriData.filter(r => r.Country.toLowerCase() === country.toLowerCase());
  return { country, record_count: records.length, records };
}

export async function fetchFSRIData() {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('fsri_data').select('*').order('country').order('year');
    if (data) {
      return data.map(r => ({
        ...r,
        Country: r.country,
        Year: r.year,
        FSRI: r.fsri,
        FSRI_Category: r.fsri_category,
        Production: r.production,
        Population: r.population,
        Self_Sufficiency_Ratio: r.self_sufficiency_ratio,
        Food_Availability_Index: r.food_availability_index,
        Production_Stability_Index: r.production_stability_index
      }));
    }
  }
  return mockData.fsriData;
}

export async function fetchCleanData() {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('clean_data').select('*').order('country').order('year');
    if (data) {
      return data.map(r => ({
        ...r,
        Country: r.country,
        Year: r.year,
        Production: r.production,
        Imports: r.imports,
        Exports: r.exports,
        Population: r.population
      }));
    }
  }
  return mockData.cleanData;
}

export async function fetchFeatureData() {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('feature_data').select('*').order('country').order('year');
    if (data) {
      return data.map(r => ({
        ...r,
        Country: r.country,
        Year: r.year,
        Yield_Growth: r.yield_growth
      }));
    }
  }
  return mockData.featureData;
}

export async function postPrediction(features) {
  try {
    const res = await fetch(`${API_BASE}/prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features, output: 'both' }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch {
    // Return mock prediction
    return mockData.mockPrediction;
  }
}

export async function fetchFeatureList() {
  const apiData = await apiFetch('/dashboard/features');
  if (apiData) return apiData.feature_list;
  return mockData.featureList;
}
