
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:8080'
).replace(/\/+$/, '');

const getToken = () => localStorage.getItem('jwtToken');

export const getDailyRevenueReport = async (date) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/desempenho?data=${encodeURIComponent(date)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authorized. Please log in again.');
      }

      const errorData = await response.json().catch(() => ({
        message: 'Error fetching report from API',
      }));

      throw new Error(errorData.message || 'Error fetching report from API');
    }

    return await response.json();

  } catch (error) {
    console.error('Erro em getDailyRevenueReport:', error);
    throw error;
  }
};

export const exportReportPDF = async (date) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/desempenho/export/pdf?data=${encodeURIComponent(date)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error exporting report to PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${date}.pdf`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error in exportReportPDF:', error);
    throw error;
  }
};

export const exportReportCSV = async (date) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/desempenho/export/csv?data=${encodeURIComponent(date)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error exporting report to CSV');
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${date}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error in exportReportCSV:', error);
    throw error;
  }
};

export const getAvailableSpots = async () => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/vagas-disponiveis`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error fetching available spots',
      }));

      throw new Error(errorData.message || 'Error fetching available spots');
    }

    return await response.json();

  } catch (error) {
    console.error('Erro em getAvailableSpots:', error);
    throw error;
  }
};

export const getVehicleHistory = async (placa) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/historico/${encodeURIComponent(placa)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('No history found for this plate');
      }

      const errorData = await response.json().catch(() => ({
        message: 'Error fetching vehicle history',
      }));

      throw new Error(errorData.message || 'Error fetching vehicle history');
    }

    return await response.json();

  } catch (error) {
    console.error('Erro em getVehicleHistory:', error);
    throw error;
  }
};

export const getOccupiedSpots = async () => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/vagas-ocupadas`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error fetching occupied spots',
      }));

      throw new Error(errorData.message || 'Error fetching occupied spots');
    }

    return await response.json();

  } catch (error) {
    console.error('Erro em getOccupiedSpots:', error);
    throw error;
  }
};

export const getEstatisticasTempoReal = async () => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/estatisticas`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching real-time statistics');
    }

    return await response.json();

  } catch (error) {
    console.error('Error in getEstatisticasTempoReal:', error);
    throw error;
  }
};

export const getEstatisticasSemanais = async () => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/relatorios/estatisticas/semanal`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error fetching weekly statistics');
    }

    return await response.json();

  } catch (error) {
    console.error('Error in getEstatisticasSemanais:', error);
    throw error;
  }
};
