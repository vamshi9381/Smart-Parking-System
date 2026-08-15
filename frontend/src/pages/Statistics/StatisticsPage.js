import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getEstatisticasTempoReal, getEstatisticasSemanais } from '../../services/api/reportsApi';

function StatisticsPage() {
  const [estatisticas, setEstatisticas] = useState({
    vagasDisponiveis: 0,
    vagasOcupadas: 0,
    totalVagas: 200,
    receitaHoje: 0,
    veiculosAtendidosHoje: 0,
    tempoMedioHoje: 0,
    ocupacaoMediaHoje: 0,
    taxaOcupacaoAtual: 0
  });

  const [estatisticasSemanais, setEstatisticasSemanais] = useState({
    receitaSemanal: 0,
    veiculosSemanal: 0,
    tempoMedioSemanal: 0,
    mediaDiariaReceita: 0,
    mediaDiariaVeiculos: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEstatisticas = async () => {
    try {
      setLoading(true);
      const [tempoReal, semanais] = await Promise.all([
        getEstatisticasTempoReal(),
        getEstatisticasSemanais()
      ]);
      
      setEstatisticas(tempoReal);
      setEstatisticasSemanais(semanais);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Error loading statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstatisticas();

    const interval = setInterval(loadEstatisticas, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getOcupacaoColor = (taxa) => {
    if (taxa >= 80) return '#f56565'; 
    if (taxa >= 60) return '#ed8936'; 
    if (taxa >= 40) return '#48bb78'; 
    return '#4299e1'; 
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>Real-Time Statistics</h1>
        <p>Full dashboard for the parking system</p>
      </div>

      <div className="stats-section">
        <h2>Current Status</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <h3>Occupied Spots</h3>
              <div className="stat-value">{estatisticas.vagasOcupadas}</div>
              <div className="stat-subtitle">of {estatisticas.totalVagas} spots</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🅿️</div>
            <div className="stat-content">
              <h3>Available Spots</h3>
              <div className="stat-value">{estatisticas.vagasDisponiveis}</div>
              <div className="stat-subtitle">ready for use</div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Revenue Today</h3>
              <div className="stat-value">{formatCurrency(estatisticas.receitaHoje)}</div>
              <div className="stat-subtitle">{estatisticas.veiculosAtendidosHoje} vehicles</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>Average Time</h3>
              <div className="stat-value">{formatTime(estatisticas.tempoMedioHoje)}</div>
              <div className="stat-subtitle">average stay today</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Occupancy Rate</h2>
        <div className="ocupacao-visual">
          <div className="ocupacao-bar">
            <div 
              className="ocupacao-fill"
              style={{ 
                width: `${estatisticas.taxaOcupacaoAtual}%`,
                backgroundColor: getOcupacaoColor(estatisticas.taxaOcupacaoAtual)
              }}
            ></div>
          </div>
          <div className="ocupacao-info">
            <span className="ocupacao-percentage">
              {estatisticas.taxaOcupacaoAtual.toFixed(1)}%
            </span>
            <span className="ocupacao-status">
              {estatisticas.taxaOcupacaoAtual >= 80 ? 'Full' :
               estatisticas.taxaOcupacaoAtual >= 60 ? 'Busy' :
               estatisticas.taxaOcupacaoAtual >= 40 ? 'Moderate' : 'Available'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Weekly Summary (Last 7 days)</h2>
        <div className="stats-grid">
          <div className="stat-card weekly">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Weekly Revenue</h3>
              <div className="stat-value">{formatCurrency(estatisticasSemanais.receitaSemanal)}</div>
              <div className="stat-subtitle">Average: {formatCurrency(estatisticasSemanais.mediaDiariaReceita)}/day</div>
            </div>
          </div>

          <div className="stat-card weekly">
            <div className="stat-icon">🚙</div>
            <div className="stat-content">
              <h3>Vehicles Served</h3>
              <div className="stat-value">{estatisticasSemanais.veiculosSemanal}</div>
              <div className="stat-subtitle">Average: {estatisticasSemanais.mediaDiariaVeiculos.toFixed(1)}/day</div>
            </div>
          </div>

          <div className="stat-card weekly">
            <div className="stat-icon">🕐</div>
            <div className="stat-content">
              <h3>Weekly Average Time</h3>
              <div className="stat-value">{formatTime(estatisticasSemanais.tempoMedioSemanal)}</div>
              <div className="stat-subtitle">average stay</div>
            </div>
          </div>

          <div className="stat-card weekly">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Performance</h3>
              <div className="stat-value">
                {estatisticas.taxaOcupacaoAtual >= 70 ? 'Excellent' :
                 estatisticas.taxaOcupacaoAtual >= 50 ? 'Good' :
                 estatisticas.taxaOcupacaoAtual >= 30 ? 'Fair' : 'Low'}
              </div>
              <div className="stat-subtitle">parking utilization</div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-actions">
        <button onClick={loadEstatisticas} className="refresh-btn">
          🔄 Refresh Statistics
        </button>
      </div>
    </div>
  );
}

export default StatisticsPage;
