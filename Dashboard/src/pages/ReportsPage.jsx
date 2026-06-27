import { useState, useMemo } from 'react';
import { FileText, Download, FileSpreadsheet, Image } from 'lucide-react';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import { mockData } from '../data/mockData';

export default function ReportsPage() {
  const [generating, setGenerating] = useState(null);

  const latestYear = Math.max(...mockData.fsriData.map(r => r.Year));
  const latestData = mockData.fsriData.filter(r => r.Year === latestYear);

  // Generate CSV
  const downloadCSV = () => {
    setGenerating('csv');
    const headers = ['Country', 'Year', 'FSRI', 'FSRI_Category', 'Production', 'Population', 'Self_Sufficiency_Ratio'];
    const rows = mockData.fsriData.map(r => headers.map(h => r[h]).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrishield_fsri_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setGenerating(null), 1000);
  };

  // Generate Excel-compatible CSV (TSV)
  const downloadExcel = () => {
    setGenerating('excel');
    const headers = ['Country', 'Year', 'FSRI', 'FSRI_Category', 'Production', 'Population'];
    const rows = mockData.fsriData.map(r => headers.map(h => r[h]).join('\t'));
    const tsv = [headers.join('\t'), ...rows].join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrishield_fsri_data_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setGenerating(null), 1000);
  };

  // Mock PDF generation
  const generatePDF = () => {
    setGenerating('pdf');
    setTimeout(() => {
      alert('PDF report generated! (In production, this would use a server-side PDF generation service.)');
      setGenerating(null);
    }, 1500);
  };

  // Mock PNG export
  const exportPNG = () => {
    setGenerating('png');
    setTimeout(() => {
      alert('Chart exported as PNG! (In production, this would use html2canvas or similar.)');
      setGenerating(null);
    }, 1000);
  };

  // Report history (mock)
  const reportHistory = [
    { id: 1, name: 'Global FSRI Report 2013', type: 'PDF', date: '2026-06-27', size: '2.4 MB' },
    { id: 2, name: 'Country Risk Analysis - Q2', type: 'PDF', date: '2026-06-15', size: '1.8 MB' },
    { id: 3, name: 'FSRI Dataset Export', type: 'CSV', date: '2026-06-10', size: '320 KB' },
    { id: 4, name: 'ML Model Performance Report', type: 'PDF', date: '2026-06-01', size: '1.2 MB' },
    { id: 5, name: 'Commodity Analytics Export', type: 'Excel', date: '2026-05-28', size: '856 KB' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Reports & Export</h1>
        <p>Generate reports, download data, and export visualizations</p>
      </div>

      {/* KPI */}
      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={FileText} label="Total Records" value={mockData.fsriData.length} color="sky" />
        <KPICard icon={Download} label="Countries" value={mockData.countries.length} color="emerald" />
        <KPICard icon={FileSpreadsheet} label="Years Covered" value={12} color="amber" />
        <KPICard icon={Image} label="Reports Generated" value={reportHistory.length} color="purple" />
      </div>

      {/* Export Actions */}
      <ChartCard title="Export Data" subtitle="Download data in various formats" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, padding: '8px 0' }}>
          <button className="btn btn-secondary" onClick={generatePDF} disabled={generating === 'pdf'} id="generate-pdf-btn"
            style={{ padding: '20px', flexDirection: 'column', alignItems: 'center', gap: 12, height: 'auto' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} style={{ color: 'var(--accent-red)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{generating === 'pdf' ? 'Generating...' : 'Generate PDF Report'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full analytics report</span>
          </button>

          <button className="btn btn-secondary" onClick={downloadCSV} disabled={generating === 'csv'} id="download-csv-btn"
            style={{ padding: '20px', flexDirection: 'column', alignItems: 'center', gap: 12, height: 'auto' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-emerald-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={24} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{generating === 'csv' ? 'Downloading...' : 'Download CSV'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Raw data export</span>
          </button>

          <button className="btn btn-secondary" onClick={downloadExcel} disabled={generating === 'excel'} id="download-excel-btn"
            style={{ padding: '20px', flexDirection: 'column', alignItems: 'center', gap: 12, height: 'auto' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-sky-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={24} style={{ color: 'var(--accent-sky)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{generating === 'excel' ? 'Downloading...' : 'Download Excel'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spreadsheet format</span>
          </button>

          <button className="btn btn-secondary" onClick={exportPNG} disabled={generating === 'png'} id="export-png-btn"
            style={{ padding: '20px', flexDirection: 'column', alignItems: 'center', gap: 12, height: 'auto' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image size={24} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <span style={{ fontWeight: 600 }}>{generating === 'png' ? 'Exporting...' : 'Export PNG'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chart screenshot</span>
          </button>
        </div>
      </ChartCard>

      {/* Report History */}
      <ChartCard title="Report History" subtitle="Previously generated reports">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportHistory.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
                      background: r.type === 'PDF' ? 'var(--accent-red-dim)' : r.type === 'CSV' ? 'var(--accent-emerald-dim)' : 'var(--accent-sky-dim)',
                      color: r.type === 'PDF' ? 'var(--accent-red)' : r.type === 'CSV' ? 'var(--accent-emerald)' : 'var(--accent-sky)',
                    }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.size}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
