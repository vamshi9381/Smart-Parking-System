const API_BASE_URL = 'http://localhost:8080';

export const loginUser = async (email, password) => { 
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: email, password: password }), 
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }
      const errorData = await response.json().catch(() => ({ message: 'Error attempting login.' }));
      throw new Error(errorData.message || 'Error attempting login.');
    }
    const data = await response.json();
    return data.token; 
  } catch (error) {
    console.error("Erro em loginUser:", error);
    throw error;
  }
};

const getToken = () => localStorage.getItem('jwtToken');

export const fetchSpotsFromAPI = async () => {
  const token = getToken();
  try {
    const responseEntradas = await fetch(`${API_BASE_URL}/estacionamento/entradas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!responseEntradas.ok) {
      if (responseEntradas.status === 401) throw new Error('Not authorized. Please log in again.');
      const errorData = await responseEntradas.json().catch(() => ({ message: 'Error fetching spots from API' }));
      throw new Error(errorData.message || 'Error fetching spots from API');
    }
    const registrosEntrada = await responseEntradas.json();
  
    const NUMERO_TOTAL_VAGAS_DO_BACKEND = 200;
    const allSpots = [];

    for (let i = 0; i < NUMERO_TOTAL_VAGAS_DO_BACKEND; i++) {
      const vagaNumero = i + 1; 
      const spotIdVisual = `Spot ${String(vagaNumero).padStart(2, '0')}`;
      allSpots.push({ 
        id: spotIdVisual,
        vagaId: vagaNumero, 
        isOccupied: false, 
        vehiclePlate: null, 
        tipoVeiculo: null, 
        entryTime: null,
        backendPlateId: null 
      });
    }

    registrosEntrada.forEach(registro => {
      if (registro && registro.veiculo && registro.vagaId) {
        const vagaIndex = registro.vagaId - 1; 
        
        if (vagaIndex >= 0 && vagaIndex < allSpots.length) {
          allSpots[vagaIndex] = {
            ...allSpots[vagaIndex],
            isOccupied: true,
            vehiclePlate: registro.veiculo.placa,
            tipoVeiculo: registro.veiculo.tipoVeiculo,
            entryTime: registro.horaEntrada ? new Date(registro.horaEntrada) : null,
            backendPlateId: registro.veiculo.placa
          };
        }
      }
    });

    return allSpots;

  } catch (error) {
    console.error("Erro em fetchSpotsFromAPI:", error);
    throw error;
  }
};

export const occupySpotInAPI = async (spotIdFrontend, vehicleData) => {
  const token = getToken();
  try {
    const vagaNumero = parseInt(spotIdFrontend.replace('Spot ', ''));
    const payload = {
      placa: vehicleData.placa,
      tipoVeiculo: vehicleData.tipoVeiculo, 
      modelo: vehicleData.modelo,
      cor: vehicleData.cor,
      vagaId: vagaNumero 
    };

    const response = await fetch(`${API_BASE_URL}/estacionamento/registar-entrada`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error registering vehicle entry in API' }));
      throw new Error(errorData.message || 'Error registering vehicle entry in API');
    }
    const registroEntrada = await response.json(); 

    return {
      id: spotIdFrontend,
      vagaId: vagaNumero,
      isOccupied: true,
      vehiclePlate: registroEntrada.veiculo.placa,
      tipoVeiculo: registroEntrada.veiculo.tipoVeiculo,
      entryTime: new Date(registroEntrada.horaEntrada),
      backendPlateId: registroEntrada.veiculo.placa
    };
  } catch (error) {
    console.error("Erro em occupySpotInAPI:", error); 
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), 
    });

    if (!response.ok) {

      let errorMessage = 'Error registering user.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || (typeof errorData === 'string' ? errorData : errorMessage);
        if (response.status === 409) { 
           errorMessage = errorData.message || "This email is already registered.";
        }
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return await response.json(); 
  } catch (error) {
    console.error("Erro em registerUser:", error);
    throw error;
  }
};

export const validateToken = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/estacionamento/entradas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      return true; 
    } else {
      localStorage.removeItem('jwtToken');
      return false;
    }
  } catch (error) {
    console.error('Error validating token:', error);
    localStorage.removeItem('jwtToken');
    return false;
  }
};

export const cancelEntryInAPI = async (vehiclePlate) => {
  const token = localStorage.getItem('jwtToken');
  try {
    const response = await fetch(`${API_BASE_URL}/estacionamento/cancelar-entrada?placa=${vehiclePlate}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Error cancelling entry in API' };
      }
      throw new Error(errorData.message || 'Error cancelling entry in API');
    }
    let result = {};
    const text = await response.text();
    if (text) {
      result = JSON.parse(text);
    }
    return result;
  } catch (error) {
    console.error("Erro em cancelEntryInAPI:", error);
    throw error;
  }
};

export const vacateSpotInAPI = async (vehiclePlate) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/estacionamento/registrar-saida?placa=${vehiclePlate}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Error vacating spot in API' };
      }
      throw new Error(errorData.message || 'Error vacating spot in API');
    }
    let saidaData = {};
    const text = await response.text();
    if (text) {
      saidaData = JSON.parse(text);
    }
    return { isOccupied: false, vehiclePlate: null, entryTime: null, backendPlateId: null, ...saidaData };
  } catch (error) {
    console.error("Erro em vacateSpotInAPI:", error);
    throw error;
  }
};