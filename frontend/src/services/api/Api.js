
const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:8080'
).replace(/\/+$/, '');

const getToken = () => localStorage.getItem('jwtToken');

// LOGIN
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password.');
      }

      const errorData = await response.json().catch(() => ({
        message: 'Error attempting login.',
      }));

      throw new Error(errorData.message || 'Error attempting login.');
    }

    const data = await response.json();
    return data.token;

  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

// FETCH PARKING SPOTS
export const fetchSpotsFromAPI = async () => {
  const token = getToken();

  try {
    const responseEntradas = await fetch(
      `${API_BASE_URL}/estacionamento/entradas`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!responseEntradas.ok) {
      if (responseEntradas.status === 401) {
        throw new Error('Not authorized. Please log in again.');
      }

      const errorData = await responseEntradas.json().catch(() => ({
        message: 'Error fetching spots from API',
      }));

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
        backendPlateId: null,
      });
    }

    registrosEntrada.forEach((registro) => {
      if (registro && registro.veiculo && registro.vagaId) {
        const vagaIndex = registro.vagaId - 1;

        if (vagaIndex >= 0 && vagaIndex < allSpots.length) {
          allSpots[vagaIndex] = {
            ...allSpots[vagaIndex],
            isOccupied: true,
            vehiclePlate: registro.veiculo.placa,
            tipoVeiculo: registro.veiculo.tipoVeiculo,
            entryTime: registro.horaEntrada
              ? new Date(registro.horaEntrada)
              : null,
            backendPlateId: registro.veiculo.placa,
          };
        }
      }
    });

    return allSpots;

  } catch (error) {
    console.error('Error in fetchSpotsFromAPI:', error);
    throw error;
  }
};

// REGISTER VEHICLE ENTRY
export const occupySpotInAPI = async (spotIdFrontend, vehicleData) => {
  const token = getToken();

  try {
    const vagaNumero = parseInt(
      spotIdFrontend.replace('Spot ', ''),
      10
    );

    const payload = {
      placa: vehicleData.placa,
      tipoVeiculo: vehicleData.tipoVeiculo,
      modelo: vehicleData.modelo,
      cor: vehicleData.cor,
      vagaId: vagaNumero,
    };

    const response = await fetch(
      `${API_BASE_URL}/estacionamento/registar-entrada`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error registering vehicle entry in API',
      }));

      throw new Error(
        errorData.message || 'Error registering vehicle entry in API'
      );
    }

    const registroEntrada = await response.json();

    return {
      id: spotIdFrontend,
      vagaId: vagaNumero,
      isOccupied: true,
      vehiclePlate: registroEntrada.veiculo.placa,
      tipoVeiculo: registroEntrada.veiculo.tipoVeiculo,
      entryTime: new Date(registroEntrada.horaEntrada),
      backendPlateId: registroEntrada.veiculo.placa,
    };

  } catch (error) {
    console.error('Error in occupySpotInAPI:', error);
    throw error;
  }
};

// REGISTER USER
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

        errorMessage =
          errorData.message ||
          (typeof errorData === 'string' ? errorData : errorMessage);

        if (response.status === 409) {
          errorMessage =
            errorData.message || 'This email is already registered.';
        }
      } catch (error) {
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

// VALIDATE JWT TOKEN
export const validateToken = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/entradas`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    }

    localStorage.removeItem('jwtToken');
    return false;

  } catch (error) {
    console.error('Error validating token:', error);
    localStorage.removeItem('jwtToken');
    return false;
  }
};

// CANCEL VEHICLE ENTRY
export const cancelEntryInAPI = async (vehiclePlate) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/cancelar-entrada?placa=${encodeURIComponent(vehiclePlate)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error cancelling entry in API',
      }));

      throw new Error(
        errorData.message || 'Error cancelling entry in API'
      );
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};

  } catch (error) {
    console.error('Error in cancelEntryInAPI:', error);
    throw error;
  }
};

// REGISTER VEHICLE EXIT
export const vacateSpotInAPI = async (vehiclePlate) => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/estacionamento/registrar-saida?placa=${encodeURIComponent(vehiclePlate)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error vacating spot in API',
      }));

      throw new Error(
        errorData.message || 'Error vacating spot in API'
      );
    }

    const text = await response.text();
    const saidaData = text ? JSON.parse(text) : {};

    return {
      isOccupied: false,
      vehiclePlate: null,
      entryTime: null,
      backendPlateId: null,
      ...saidaData,
    };

  } catch (error) {
    console.error('Error in vacateSpotInAPI:', error);
    throw error;
  }
};
