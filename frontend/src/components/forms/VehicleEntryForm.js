import React, { useState } from 'react';
import { toast } from 'react-toastify'; 

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  padding: '40px',
  borderRadius: '25px',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
  zIndex: 1000,
  width: '90%',
  maxWidth: '500px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  animation: 'modalEnter 0.3s ease-out',
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(5px)',
  zIndex: 999,
  animation: 'overlayEnter 0.3s ease-out',
};

const formGroupStyles = {
  marginBottom: '25px',
};

const labelStyles = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#4a5568',
  fontSize: '0.95em',
};

const inputStyles = {
  width: '100%',
  padding: '15px 18px',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  boxSizing: 'border-box',
  fontSize: '1em',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
};

const inputErrorStyles = {
  ...inputStyles,
  border: '2px solid #f56565',
  backgroundColor: '#fed7d7',
};

const selectStyles = {
  ...inputStyles,
  cursor: 'pointer',
};

const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '15px',
  marginTop: '30px',
};

const buttonBaseStyles = {
  padding: '16px 24px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.1em',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  minWidth: '120px',
};

const submitButtonStyles = {
  ...buttonBaseStyles,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
};

const cancelButtonStyles = {
  ...buttonBaseStyles,
  background: '#e2e8f0',
  color: '#4a5568',
};

const errorMessageStyles = {
  color: '#c53030',
  fontSize: '0.9em',
  marginTop: '5px',
  padding: '8px',
  background: '#fed7d7',
  borderRadius: '5px',
  borderLeft: '4px solid #f56565',
};

const inputHintStyles = {
  color: '#666',
  fontSize: '0.8em',
  marginTop: '5px',
  display: 'block',
  lineHeight: '1.4',
};

const titleStyles = {
  margin: '0 0 30px 0',
  color: '#2d3748',
  fontWeight: '600',
  fontSize: '1.5em',
  textAlign: 'center',
};

function VehicleEntryForm({ spotId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    placa: '',
    tipoVeiculo: 'CARRO',
    modelo: '',
    cor: ''
  });
  
  const [errors, setErrors] = useState({});

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const validarPlaca = (placa) => {
  const placaLimpa = placa.trim();
  
  if (!placaLimpa) {
    return "Plate is required";
  }
  if (/[^a-zA-Z0-9]/.test(placaLimpa)) {
    return "❌ Plate cannot contain special characters (@#!$%-). Use only letters and numbers.";
  }
  if (placaLimpa.length !== 7) {
    return "❌ Plate must be exactly 7 characters (ABC1234).";
  }
  if (/[a-z]/.test(placaLimpa)) {
    return "❌ All letters in the plate must be uppercase.";
  }

  const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/; 
  const formatoMercosulCarro = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/; 
  const formatoMercosulMoto = /^[A-Z]{3}[0-9]{2}[A-Z]{1}[0-9]{1}$/; 
  
  if (!formatoAntigo.test(placaLimpa) && 
      !formatoMercosulCarro.test(placaLimpa) && 
      !formatoMercosulMoto.test(placaLimpa)) {
    return "❌ Invalid plate format. Use: ABC1234 (old) or ABC1A23 (Mercosul).";
  }
  
    return null; 
  };

  const formatarPlaca = (placa) => {
    if (!placa) return '';
    return placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  const validarModelo = (modelo) => {
    const modeloLimpo = modelo.trim();
    
    if (!modeloLimpo) {
      return "Model is required";
    }
    
    if (/^\d+$/.test(modeloLimpo)) {
      return "❌ Model cannot be only numbers.";
    }
    
    if (/[^a-zA-ZÀ-ÿ\s\d]/.test(modeloLimpo)) {
      return "❌ Model cannot contain special characters (@#!$%).";
    }
    
    if (modeloLimpo.length < 2) {
      return "❌ Model must have at least 2 characters";
    }
    
    return null; 
  };

  const validarCor = (cor) => {
    const corLimpa = cor.trim();

    if (!corLimpa) {
      return "Color is required";
    }

    if (/^\d+$/.test(corLimpa)) {
      return "❌ Color cannot be only numbers. Use names like: white, black, blue, etc.";
    }

    if (/[^a-zA-ZÀ-ÿ\s]/.test(corLimpa)) {
      return "❌ Color cannot contain special characters (@#!$%). Use letters only.";
    }

    if (/\d{3,}/.test(corLimpa)) {
      return "❌ Color cannot contain number sequences. Use color names.";
    }
    
    if (corLimpa.length < 3) {
      return "❌ Color must have at least 3 characters";
    }
    
    return null; 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'placa') {
      const placaFormatada = formatarPlaca(value);
      setFormData(prev => ({ ...prev, [name]: placaFormatada }));

      const erroPlaca = validarPlaca(placaFormatada);
      setErrors(prev => ({ ...prev, placa: erroPlaca }));
      
    } else if (name === 'modelo') {
      const modeloFormatado = capitalizeFirstLetter(value);
      setFormData(prev => ({ ...prev, [name]: modeloFormatado }));
      const erroModelo = validarModelo(value);
      setErrors(prev => ({ ...prev, modelo: erroModelo }));
      
    } else if (name === 'cor') {
      const corFormatada = capitalizeFirstLetter(value);
      setFormData(prev => ({ ...prev, [name]: corFormatada }));
      const erroCor = validarCor(corFormatada);
      setErrors(prev => ({ ...prev, cor: erroCor }));
      
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const erroPlaca = validarPlaca(formData.placa);
    if (erroPlaca) {
      setErrors(prev => ({ ...prev, placa: erroPlaca }));
      toast.error(erroPlaca);
      return;
    }

    const erroModelo = validarModelo(formData.modelo);
    if (erroModelo) {
      setErrors(prev => ({ ...prev, modelo: erroModelo }));
      toast.error(erroModelo);
      return;
    }

    const erroCor = validarCor(formData.cor);
    if (erroCor) {
      setErrors(prev => ({ ...prev, cor: erroCor }));
      toast.error(erroCor);
      return;
    }
    
    onSubmit(formData);
  };
  return (
    <>
      <div style={overlayStyles} onClick={onCancel} />
      <div style={modalStyles}>
        <h3 style={titleStyles}>🚗 Register Entry - {spotId}</h3>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyles}>
            <label htmlFor="placa" style={labelStyles}>Plate:</label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              placeholder="ABC1234"
              maxLength="7"
              style={errors.placa ? inputErrorStyles : inputStyles}
              required
            />
            {errors.placa && (
              <div style={errorMessageStyles}>
                {errors.placa}
              </div>
            )}
            <small style={inputHintStyles}>
              ✅ Letters will be converted to uppercase automatically<br/>
              ✅ Accepted formats: ABC1234 (old) or ABC1A23 (Mercosul)<br/>
              ❌ Do not use symbols: @#!$%-, etc.
            </small>
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="tipoVeiculo" style={labelStyles}>Type:</label>
            <select
              id="tipoVeiculo"
              name="tipoVeiculo"
              value={formData.tipoVeiculo}
              onChange={handleInputChange}
              style={selectStyles}
              required
            >
              <option value="CARRO">🚗 Car</option>
              <option value="MOTO">🏍️ Motorcycle</option>
            </select>
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="modelo" style={labelStyles}>Model:</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleInputChange}
              placeholder="Ex: Civic, Corolla"
              style={errors.modelo ? inputErrorStyles : inputStyles}
              required
            />
            {errors.modelo && (
              <div style={errorMessageStyles}>
                {errors.modelo}
              </div>
            )}
            <small style={inputHintStyles}>
              ✅ First letter will be capitalized automatically<br/>
              ❌ Do not use only numbers: 123, 456, etc.
            </small>
          </div>

          <div style={formGroupStyles}>
            <label htmlFor="cor" style={labelStyles}>Color:</label>
            <input
              type="text"
              id="cor"
              name="cor"
              value={formData.cor}
              onChange={handleInputChange}
              placeholder="Ex: White, Black, Blue"
              style={errors.cor ? inputErrorStyles : inputStyles}
              required
            />
            {errors.cor && (
              <div style={errorMessageStyles}>
                {errors.cor}
              </div>
            )}
            <small style={inputHintStyles}>
              ✅ Use color names: white, black, blue, red, etc.<br/>
              ❌ Do not use numbers: 123, 456, etc.
            </small>
          </div>

          <div style={buttonContainerStyles}>
            <button 
              type="button" 
              onClick={onCancel} 
              style={cancelButtonStyles}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={submitButtonStyles}
            >
              Register Entry
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default VehicleEntryForm;
