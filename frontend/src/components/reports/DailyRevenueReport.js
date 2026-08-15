import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getDailyRevenueReport, exportReportPDF, exportReportCSV } from '../../services/api/reportsApi';

function DailyRevenueReport() {
  const [reportData, setReportData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [flippedCards, setFlippedCards] = useState({
    revenue: false,
    vehicles: false,
    avgTime: false,
    occupancy: false
  });

  const loadReport = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailyRevenueReport(date);
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportReportPDF(selectedDate);
      toast.success('📄 PDF exported successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`❌ Error exporting PDF: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await exportReportCSV(selectedDate);
      toast.success('📊 CSV exported successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`❌ Error exporting CSV: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
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
    <div className="daily-revenue-report">
      <div className="report-header">
          <h2>📊 Daily Revenue Report</h2>
          <div className="date-selector">
            <label htmlFor="report-date">Date:</label>
          <input
            type="date"
            id="report-date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {loading && <div className="loading">⏳ Loading report...</div>}
      
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
                    Sum of all payments made during the day.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>

            <div className="flip-card" onClick={() => toggleFlip('vehicles')}>
              <div className={`flip-card-inner ${flippedCards.vehicles ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card vehicles">
                  <h3>🚗 Vehicles Served</h3>
                  <div className="value">{reportData.quantidade || 0}</div>
                    <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card vehicles">
                    <h3>🚗 Vehicles Served</h3>
                  <div className="description">
                    Number of vehicles that used the parking lot during the day.
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
                    Average duration vehicles stayed in the parking lot during the day.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>

            <div className="flip-card" onClick={() => toggleFlip('occupancy')}>
              <div className={`flip-card-inner ${flippedCards.occupancy ? 'flipped' : ''}`}>
                <div className="flip-card-front report-card occupancy">
                  <h3>📈 Occupancy Rate</h3>
                  <div className="value">{((reportData.ocupacaoMedia || 0) * 100).toFixed(1)}%</div>
                    <small className="flip-hint">💡 Click to see description</small>
                </div>
                <div className="flip-card-back report-card occupancy">
                    <h3>📈 Occupancy Rate</h3>
                  <div className="description">
                    Average percentage of occupied spots throughout the day.
                  </div>
                  <small className="flip-hint">💡 Click to return to value</small>
                </div>
              </div>
            </div>
          </div>

          <div className="export-section">
            <h3>📥 Export Report</h3>
            <div className="export-buttons">
              <button 
                onClick={handleExportPDF} 
                disabled={exporting}
                className="export-btn pdf-btn"
              >
                {exporting ? '⏳ Exporting...' : '📄 Export PDF'}
              </button>
              <button 
                onClick={handleExportCSV} 
                disabled={exporting}
                className="export-btn csv-btn"
              >
                {exporting ? '⏳ Exporting...' : '📊 Export CSV'}
              </button>
            </div>
          </div>

          <div className="report-summary">
            <h3>📋 Day Summary</h3>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US')}</p>
              <p><strong>Total vehicles:</strong> {reportData.quantidade || 0}</p>
              <p><strong>Revenue generated:</strong> {formatCurrency(reportData.receitaTotal || 0)}</p>
              <p><strong>Average duration:</strong> {formatTime(reportData.tempoMedioHoras || 0)}</p>
              <p><strong>Average occupancy rate:</strong> {((reportData.ocupacaoMedia || 0) * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyRevenueReport;