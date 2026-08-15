import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { registerUser } from '../../services/api/Api';

function RegisterAdminPage() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validarNome = (nome, campo) => {
    const nomeLimpo = nome.trim();
    
    if (!nomeLimpo) {
      return `${campo} is required`;
    }
    if (/[^a-zA-ZÀ-ÿ\s]/.test(nomeLimpo)) {
      return `❌ ${campo} cannot contain numbers or special characters`;
    }
    
    if (nomeLimpo.length < 2) {
      return `❌ ${campo} must have at least 2 characters`;
    }
    
    return null;
  };

  const validarEmail = (email) => {
    const emailLimpo = email.trim();
    
    if (!emailLimpo) {
      return "Email is required";
    }

    if (/[^a-zA-Z0-9@._-]/.test(emailLimpo)) {
      return "❌ Email cannot contain special characters except @, ., _ and -";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailLimpo)) {
      return "❌ Invalid email format";
    }
    
    return null;
  };

  const validarSenha = (senha) => {
    const senhaLimpa = senha.trim();
    
    if (!senhaLimpa) {
      return "Password is required";
    }

    if (/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senhaLimpa)) {
      return "❌ Password contains disallowed characters";
    }
    
    if (senhaLimpa.length < 8) {
      return "❌ Password must be at least 8 characters";
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(senhaLimpa)) {
      return "❌ Password must contain at least one letter and one number";
    }
    
    return null;
  };

  const capitalizarNome = (nome) => {
    if (!nome) return '';
    return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  };

  const handleNameChange = (e) => {
    const valor = capitalizarNome(e.target.value);
    setName(valor);
    const erro = validarNome(valor, 'Nome');
    setErrors(prev => ({ ...prev, name: erro }));
  };

  const handleLastnameChange = (e) => {
    const valor = capitalizarNome(e.target.value);
    setLastname(valor);
    const erro = validarNome(valor, 'Sobrenome');
    setErrors(prev => ({ ...prev, lastname: erro }));
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setEmail(valor);
    const erro = validarEmail(valor);
    setErrors(prev => ({ ...prev, email: erro }));
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    setPassword(valor);
    const erro = validarSenha(valor);
    setErrors(prev => ({ ...prev, password: erro }));

    if (confirmPassword) {
      const erroConfirm = valor !== confirmPassword ? "❌ Passwords do not match" : null;
      setErrors(prev => ({ ...prev, confirmPassword: erroConfirm }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const valor = e.target.value;
    setConfirmPassword(valor);
    const erro = valor !== password ? "❌ Passwords do not match" : null;
    setErrors(prev => ({ ...prev, confirmPassword: erro }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');

    const erroName = validarNome(name, 'Nome');
    const erroLastname = validarNome(lastname, 'Sobrenome');
    const erroEmail = validarEmail(email);
    const erroPassword = validarSenha(password);
    const erroConfirm = password !== confirmPassword ? "❌ Passwords do not match" : null;

    if (erroName || erroLastname || erroEmail || erroPassword || erroConfirm) {
      setErrors({
        name: erroName,
        lastname: erroLastname,
        email: erroEmail,
        password: erroPassword,
        confirmPassword: erroConfirm
      });
      toast.error('❌ Fix the errors before continuing');
      return;
    }

    setLoading(true);
    try {
      const userData = { 
        name: name.trim(), 
        lastname: lastname.trim(), 
        email: email.trim(), 
        password: password.trim() 
      };
      await registerUser(userData);
      setSuccessMessage('✅ Administrator registered successfully!');
      toast.success('🎉 Administrator registered successfully!');

      setName('');
      setLastname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      setError(err.message || 'Failed to register administrator.');
      toast.error(`❌ ${err.message || 'Failed to register administrator.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="register-admin-container">
          <h2>👤 Register Initial Administrator</h2>
          <p>This page should be used only once to create the primary administrator account.</p>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">First Name:</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={handleNameChange}
              className={errors.name ? 'input-error' : ''}
              required 
            />
            {errors.name && (
              <div className="error-message">
                {errors.name}
              </div>
            )}
            <small>
              ✅ First letter will be capitalized automatically
            </small>
          </div>
          
          <div>
            <label htmlFor="lastname">Last Name:</label>
            <input 
              type="text" 
              id="lastname" 
              value={lastname} 
              onChange={handleLastnameChange}
              className={errors.lastname ? 'input-error' : ''}
              required 
            />
            {errors.lastname && (
              <div className="error-message">
                {errors.lastname}
              </div>
            )}
            <small>
              ✅ First letter will be capitalized automatically
            </small>
          </div>
          
          <div>
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={handleEmailChange}
              className={errors.email ? 'input-error' : ''}
              required 
            />
            {errors.email && (
              <div className="error-message">
                {errors.email}
              </div>
            )}
            <small>
              ✅ Use only letters, numbers and @, ., _, -
            </small>
          </div>
          
          <div>
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={handlePasswordChange}
              className={errors.password ? 'input-error' : ''}
              required 
            />
            {errors.password && (
              <div className="error-message">
                {errors.password}
              </div>
            )}
            <small>
              ✅ Minimum 8 characters, at least 1 letter and 1 number
            </small>
          </div>
          
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={handleConfirmPasswordChange}
              className={errors.confirmPassword ? 'input-error' : ''}
              required 
            />
            {errors.confirmPassword && (
              <div className="error-message">
                {errors.confirmPassword}
              </div>
            )}
            <small>
              ✅ Type the same password to confirm
            </small>
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          
          <button 
            type="submit" 
            disabled={loading || Object.values(errors).some(erro => erro)}
          >
            {loading ? '⏳ Registering...' : '✅ Register Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAdminPage;
