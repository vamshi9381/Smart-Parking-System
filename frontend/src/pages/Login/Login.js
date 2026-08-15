import { useState } from 'react';
import { toast } from 'react-toastify';
import { loginUser } from '../../services/api/Api';

function LoginWebsite({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(senhaLimpa))  {
      return "❌ Password contains disallowed characters";
    }
    
    if (senhaLimpa.length < 6) {
      return "❌ Password must be at least 8 characters";
    }
    
    return null;
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    
    const erro = validarEmail(valor);
    setErrors(prev => ({ ...prev, email: erro }));
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    setPassword(valor);
    
    const erro = validarSenha(valor);
    setErrors(prev => ({ ...prev, password: erro }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const erroEmail = validarEmail(email);
    const erroSenha = validarSenha(password);
    
    if (erroEmail || erroSenha) {
      setErrors({ email: erroEmail, password: erroSenha });
      toast.error('❌ Fix the errors before continuing');
      return;
    }
    
    setLoading(true);
    try {
      const token = await loginUser(email.trim(), password.trim());
      localStorage.setItem('jwtToken', token); 
      if (onLoginSuccess) {
        onLoginSuccess(token);
      }
      toast.success('🎉 Login successful!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.message);
      toast.error(`❌ ${err.message}`, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="login-container">
        <h2>👤 Login</h2>
        <form onSubmit={handleSubmit}>
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
              ✅ Minimum 8 characters, no special symbols
            </small>
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading || errors.email || errors.password}
          >
            {loading ? '⏳ Signing in...' : '🚪 Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginWebsite;
