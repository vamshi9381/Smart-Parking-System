import { useState, useEffect, useCallback } from 'react'; 
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080';
const getToken = () => localStorage.getItem('jwtToken');

  const getMonthlyReport = async (mes, ano) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/estacionamento/relatorios/mensal?mes=${mes}&ano=${ano}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error fetching monthly report');
  return await response.json();
};

  const exportMonthlyReportPDF = async (mes, ano) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/estacionamento/relatorios/mensal/export/pdf?mes=${mes}&ano=${ano}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error exporting monthly PDF');
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio-mensal-${mes}-${ano}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

function MonthlyRevenueReport() {
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [flippedCards, setFlippedCards] = useState({
    revenue: false,
    vehicles: false,
    avgTime: false,
    bestDay: false
  });

  const meses = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMonthlyReport(selectedMonth, selectedYear);
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportMonthlyReportPDF(selectedMonth, selectedYear);
      toast.success('📄 Monthly PDF exported successfully!');
    } catch (error) {
      toast.error(`❌ Error exporting PDF: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const toggleFlip = (cardType) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardType]: !prev[cardType]
    }));
  };

  return (
    <div className="monthly-revenue-report">
      <div className="report-header">
        <h2>📅 Monthly Report</h2>
        <div className="date-selector">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ marginRight: '10px', padding: '8px', borderRadius: '5px' }}
          >
            {meses.slice(1).map((mes, index) => (
              <option key={index + 1} value={index + 1}>{mes}</option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: '8px', borderRadius: '5px' }}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading">⏳ Loading monthly report...</div>}
      
      {error && <div className="error-message">❌ Error: {error}</div>}

      {reportData && !loading && (
        <div className="report-content">
          <div className="report-cards">
            <div className="flip-card" onClick={() => toggleFlip('revenue')}>
              <div className={`flip-card-inner ${flippedCards.revenue ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card revenue">
                  <h3>💰 Total Revenue</h3>
                  <div className="value">{formatCurrency(reportData.receitaTotal || 0)}</div>
                  <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card revenue">
                  <h3>💰 Total Revenue</h3>
                  <div className="description">
                    Sum of all payments made during the month.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>

            <div className="flip-card" onClick={() => toggleFlip('vehicles')}>
              <div className={`flip-card-inner ${flippedCards.vehicles ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card vehicles">
                  <h3>🚗 Vehicles Served</h3>
                  <div className="value">{reportData.totalVeiculos || 0}</div>
                  <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card vehicles">
                  <h3>🚗 Vehicles Served</h3>
                  <div className="description">
                    Number of vehicles that used the parking lot during the month.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>

            <div className="flip-card" onClick={() => toggleFlip('avgTime')}>
              <div className={`flip-card-inner ${flippedCards.avgTime ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card avg-time">
                  <h3>⏱️ Average Time</h3>
                  <div className="value">{formatTime(reportData.tempoMedioHoras || 0)}</div>
                  <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card avg-time">
                  <h3>⏱️ Average Time</h3>
                  <div className="description">
                    Average duration vehicles stayed in the parking lot during the month.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>

            <div className="flip-card" onClick={() => toggleFlip('bestDay')}>
              <div className={`flip-card-inner ${flippedCards.bestDay ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card best-day">
                  <h3>🏆 Best Day</h3>
                  <div className="value">
                    Day {reportData.melhorDia}
                    <div style={{ fontSize: '0.7em', marginTop: '5px' }}>
                      {formatCurrency(reportData.melhorReceita || 0)}
                    </div>
                  </div>
                  <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card best-day">
                  <h3>🏆 Best Day</h3>
                  <div className="description">
                    Day of the month with the highest revenue generated.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>
          </div>

          <div className="monthly-stats">
            <h3>📊 Monthly Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Average Daily Revenue:</span>
                <span className="stat-value">{formatCurrency(reportData.receitaMediaDiaria || 0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Daily Vehicles:</span>
                <span className="stat-value">{(reportData.veiculosMediaDiaria || 0).toFixed(1)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Days in Month:</span>
                <span className="stat-value">{reportData.diasNoMes}</span>
              </div>
            </div>
          </div>

          <div className="export-section">
            <h3>📥 Export Monthly Report</h3>
            <div className="export-buttons">
              <button 
                onClick={handleExportPDF} 
                disabled={exporting}
                className="export-btn pdf-btn"
              >
                {exporting ? '⏳ Exporting...' : '📄 Export PDF'}
              </button>
            </div>
          </div>

          <div className="report-summary">
            <h3>📋 Summary for {meses[selectedMonth]} {selectedYear}</h3>
            <p><strong>Period:</strong> {meses[selectedMonth]} {selectedYear}</p>
            <p><strong>Total vehicles:</strong> {reportData.totalVeiculos || 0}</p>
            <p><strong>Revenue generated:</strong> {formatCurrency(reportData.receitaTotal || 0)}</p>
            <p><strong>Average duration:</strong> {formatTime(reportData.tempoMedioHoras || 0)}</p>
            <p><strong>Best day of the month:</strong> Day {reportData.melhorDia} with {formatCurrency(reportData.melhorReceita || 0)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyRevenueReport;
