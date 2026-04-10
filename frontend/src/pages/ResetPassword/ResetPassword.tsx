import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Sun, Moon, Ship, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useTheme } from '../../hooks/useTheme';
import styles from './ResetPassword.module.css';
import navopsLogo from '../../assets/logo.png';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Limpiar error al tipear
  useEffect(() => {
    if (error) setError('');
  }, [newPassword, repeatPassword]);

  const validatePasswordStrength = (pwd: string) => {
    const minLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&#._-]/.test(pwd);

    if (!minLength || !hasUpper || !hasNumber || !hasSpecial) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
           {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <div className={styles.card}>
          <div className={styles.successContainer}>
            <CheckCircle2 size={100} strokeWidth={1.5} className={styles.successIcon} />
            <h2 className={styles.successMessage}>
              Tu contraseña fue actualizada con éxito
            </h2>
            <div className={styles.successAction}>
              <Button onClick={() => navigate('/login')}>Aceptar</Button>
            </div>
          </div>
        </div>
        <div className={styles.footer}>Sistema de Gestión Marítima V.1</div>
      </div>
    );
  }

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

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Restablecer contraseña</h2>
          
          {error && <div className={styles.globalError}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              label="Nueva Contraseña"
              placeholder="Contraseña"
              icon={<Lock size={18} />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              rightIcon={
                showNewPassword ? 
                <EyeOff size={18} onClick={() => setShowNewPassword(false)} /> : 
                <Eye size={18} onClick={() => setShowNewPassword(true)} />
              }
            />

            <Input
              type={showRepeatPassword ? 'text' : 'password'}
              label="Repetir Contraseña"
              placeholder="Contraseña"
              icon={<Lock size={18} />}
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={isLoading}
              rightIcon={
                showRepeatPassword ? 
                <EyeOff size={18} onClick={() => setShowRepeatPassword(false)} /> : 
                <Eye size={18} onClick={() => setShowRepeatPassword(true)} />
              }
            />

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
                disabled={!newPassword || !repeatPassword}
              >
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.footer}>
        Sistema de Gestión Marítima V.1
      </div>
    </div>
  );
};
