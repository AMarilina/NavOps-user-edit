import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Ship } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { useTheme } from '../../hooks/useTheme';
import styles from './VerifyToken.module.css';
import navopsLogo from '../../assets/logo.png';
import { FeedbackModal } from '../../components/ui/FeedbackModal/FeedbackModal';

export const VerifyToken: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Obtenemos el email pasado por estado desde "ForgotPassword"
  // Si no hay email, significa que el usuario accedió directo a la ruta, lo redirigimos
  const emailFromState = location.state?.email || '';

  const [otp, setOtp] = useState<string[]>(new Array(8).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

  useEffect(() => {
    if (!emailFromState) {
      navigate('/login');
    }
  }, [emailFromState, navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value)) && !/^[a-zA-Z0-9]+$/.test(element.value)) return false;

    const val = element.value.toUpperCase();
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Mueve al siguiente input si hay un valor ingresado
    if (val && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Mueve hacia atras al borrar el vacio
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (pasteData) {
      const pasteArray = pasteData.split('').slice(0, 8);
      const newOtp = [...otp];
      pasteArray.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      
      // Mueve el foco al input siguiente al pegado o al último posible
      const focusIndex = Math.min(pasteArray.length, 7);
      inputRefs.current[focusIndex]?.focus();
    }
  };
    
    // ... resto del código igual*/ 
  const isFormValid = otp.every(char => char !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError('');

    const rawcode = otp.join('');

    const formattedCode = `${rawcode.slice(0, 4)} - ${rawcode.slice(4)}`;

    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromState, code: formattedCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'El código ingresado no es válido o ha expirado');
      }

      // El token jwt viene en data.resetToken según AuthService
      // Navegamos al reset-password pasándole el token para uso futuro
      navigate('/reset-password', { state: { token: data.resetToken, email: emailFromState } });

    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromState }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al reenviar el código');
      }

      setSuccess('Te hemos enviado un nuevo código de verificación');
      // Reseteamos el código ingresado para forzar que ingrese el nuevo
      setOtp(new Array(8).fill(''));
      inputRefs.current[0]?.focus();

    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta nuevamente.');
    } finally {
      setIsResending(false);
    }
  };

  if (!emailFromState) return null; // Evita un render parpadeante antes del redireccionamiento

  return (
    <div className={styles.container}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          {!imgError ? (
            <img
              src={navopsLogo}
              alt="NavOps Logo"
              className={styles.logoImage}
              onError={() => setImgError(true)}
            />
          ) : (
            <Ship size={60} />
          )}

          <h1 className={styles.title}>NavOps</h1>
          <p className={styles.subtitle}>
            Control de Navegación y Logística
          </p>
        </div>

        <h2 className={styles.title} style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
          Ingrese el código de verificación
        </h2>
        
        <p className={styles.subtitle} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Hemos enviado el e-mail a <span className={styles.subtitleHighlight}>{emailFromState}</span>
        </p>

        {error && <div className={styles.globalError}>{error}</div>}
        {success && ( <FeedbackModal message={success} onClose={() => setSuccess('')}/>)}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.otpContainer} onPaste={handlePaste}>
            {otp.map((data, index) => (
              <React.Fragment key={index}>
                <input
                  className={styles.otpInput}
                  type="text"
                  name={`otp-${index}`}
                  maxLength={1}
                  value={data}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  disabled={isLoading}
                  autoComplete="off"
                />
              </React.Fragment>
            ))}
        </div>

          <div className={styles.resendText}>
            ¿Aún no has recibido el correo?{' '}
            <button 
              type="button" 
              className={styles.resendLink} 
              onClick={handleResend}
              disabled={isResending || isLoading}
            >
              {isResending ? 'Enviando...' : 'Reenviar código'}
            </button>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/login')}
              disabled={isLoading}
            >
              Volver
            </Button>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid || isLoading}
            >
              Validar
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.footer}>
        Sistema de Gestión Marítima V.1
      </div>
    </div>
  );
};
