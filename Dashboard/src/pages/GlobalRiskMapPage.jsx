import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
import ChartCard from '../components/ui/ChartCard';
import RiskBadge, { getRiskColor } from '../components/ui/RiskBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchFSRIData } from '../lib/api';

const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

function getCountryColor(fsri) {
  if (fsri === undefined || fsri === null) return '#1e293b';
  if (fsri >= 75) return '#ef4444';
  if (fsri >= 50) return '#f97316';
  if (fsri >= 30) return '#f59e0b';
  if (fsri >= 20) return '#22c55e';
  return '#16db93';
}

function getFSRICat(score) {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High Risk';
  if (score >= 30) return 'Medium';
  if (score >= 20) return 'Safe';
  return 'Very Safe';
}

function MapLegend() {
  const levels = [
    { label: 'Very Safe (< 20)', color: '#16db93' },
    { label: 'Safe (20-30)', color: '#22c55e' },
    { label: 'Medium (30-50)', color: '#f59e0b' },
    { label: 'High Risk (50-75)', color: '#f97316' },
    { label: 'Critical (> 75)', color: '#ef4444' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 24, right: 24, zIndex: 1000,
      background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
      padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>FSRI Risk Level</span>
      {levels.map(l => (
        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: '#94a3b8' }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: l.color, flexShrink: 0 }} />
          {l.label}
        </div>
      ))}
    </div>
  );
}

function FlyToCountry({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 5, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

export default function GlobalRiskMapPage() {
  const [fsriData, setFsriData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [flyCoords, setFlyCoords] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchFSRIData(),
      fetch(GEOJSON_URL).then(r => r.json()).catch(() => null),
    ]).then(([f, geo]) => {
      setFsriData(f);
      setGeoData(geo);
    }).finally(() => setLoading(false));
  }, []);

  // Build country → FSRI lookup (latest year)
  const countryFSRI = useMemo(() => {
    const map = {};
    const latestYear = Math.max(...fsriData.map(r => r.Year));
    fsriData.filter(r => r.Year === latestYear).forEach(r => {
      map[r.Country.toLowerCase()] = r;
    });
    return map;
  }, [fsriData]);

  // Country search results
  const countries = useMemo(() => [...new Set(fsriData.map(r => r.Country))].sort(), [fsriData]);
  const searchResults = search.length > 0
    ? countries.filter(c => c.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  // Style each GeoJSON feature
  const geoStyle = (feature) => {
    const name = feature.properties.ADMIN?.toLowerCase() || feature.properties.name?.toLowerCase() || '';
    const data = countryFSRI[name];
    return {
      fillColor: data ? getCountryColor(data.FSRI) : '#1e293b',
      weight: 0.8,
      opacity: 1,
      color: 'rgba(255,255,255,0.1)',
      fillOpacity: data ? 0.75 : 0.3,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.ADMIN || feature.properties.name || 'Unknown';
    const data = countryFSRI[name.toLowerCase()];
    const fsri = data ? data.FSRI.toFixed(1) : 'N/A';
    const cat = data ? data.FSRI_Category : 'No Data';
    const pop = data ? Number(data.Population).toLocaleString() + 'K' : 'N/A';

    layer.bindPopup(`
      <div style="min-width:180px">
        <strong style="font-size:0.95rem">${name}</strong><br/>
        <span style="color:${data ? getRiskColor(cat) : '#94a3b8'}; font-weight:700; font-size:1.2rem">${fsri}</span>
        <span style="font-size:0.75rem; color:#94a3b8; margin-left:6px">${cat}</span><br/>
        <span style="font-size:0.78rem; color:#94a3b8">Population: ${pop}</span>
      </div>
    `);

    layer.on('mouseover', () => {
      layer.setStyle({ weight: 2, color: '#16db93', fillOpacity: 0.9 });
    });
    layer.on('mouseout', () => {
      layer.setStyle(geoStyle(feature));
    });
    layer.on('click', () => {
      setSelectedCountry(data || { Country: name, FSRI: null, FSRI_Category: 'No Data' });
    });
  };

  const handleSearchSelect = (country) => {
    setSearch(country);
    if (geoData) {
      const feature = geoData.features.find(f =>
        (f.properties.ADMIN || f.properties.name || '').toLowerCase() === country.toLowerCase()
      );
      if (feature && feature.geometry) {
        const coords = feature.geometry.type === 'Polygon'
          ? feature.geometry.coordinates[0]
          : feature.geometry.coordinates[0][0];
        const lats = coords.map(c => c[1]);
        const lngs = coords.map(c => c[0]);
        setFlyCoords([(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2]);
      }
    }
    setSelectedCountry(countryFSRI[country.toLowerCase()] || null);
  };

  if (loading) return <LoadingSpinner text="Loading global risk map..." />;

  return (
    <div>
      <div className="page-header">
        <h1>Global Risk Map</h1>
        <p>Interactive world map colored by Food Security Risk Index (FSRI)</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
        <div className="search-box" style={{ minWidth: 'auto' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="map-country-search"
          />
        </div>
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2000,
            background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, marginTop: 4, maxHeight: 260, overflowY: 'auto',
          }}>
            {searchResults.map(c => {
              const d = countryFSRI[c.toLowerCase()];
              return (
                <div
                  key={c}
                  onClick={() => handleSearchSelect(c)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{c}</span>
                  {d && <span style={{ color: getRiskColor(d.FSRI_Category), fontWeight: 600, fontSize: '0.8rem' }}>{d.FSRI.toFixed(1)}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="map-container" style={{ height: 520, position: 'relative' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2.5}
          minZoom={2}
          maxZoom={8}
          style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {geoData && (
            <GeoJSON
              key="geojson"
              data={geoData}
              style={geoStyle}
              onEachFeature={onEachFeature}
            />
          )}
          <FlyToCountry coords={flyCoords} />
        </MapContainer>
        <MapLegend />
      </div>

      {/* Selected country info */}
      {selectedCountry && (
        <div className="card" style={{ marginTop: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Country</span>
            <h3 style={{ marginTop: 4 }}>{selectedCountry.Country}</h3>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>FSRI Score</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedCountry.FSRI ? getRiskColor(selectedCountry.FSRI_Category) : 'var(--text-muted)' }}>
              {selectedCountry.FSRI ? selectedCountry.FSRI.toFixed(1) : 'N/A'}
            </p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Risk Level</span>
            <div style={{ marginTop: 4 }}>
              <RiskBadge category={selectedCountry.FSRI_Category} />
            </div>
          </div>
          {selectedCountry.Population && (
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Population</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-heading)' }}>{Number(selectedCountry.Population).toLocaleString()}K</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
