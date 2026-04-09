import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Sun, Moon, Ship } from 'lucide-react';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useTheme } from '../../hooks/useTheme';
import styles from './ForgotPassword.module.css';
import navopsLogo from '../../assets/logo.png';
import { FeedbackModal } from '../../components/ui/FeedbackModal/FeedbackModal';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

  useEffect(() => {
    if (error) setError('');
    if (success) setSuccess('');
  }, [email]);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Debe ingresar un correo válido';

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return 'Debe ingresar un correo válido';

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Correo no encontrado o no registrado');
      }

      setSuccess('Se ha enviado un enlace a tu correo electrónico');

    } catch (err: any) {
      setError(err.message || 'Error de red. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = validateEmail(email) === '';

  const [imgError, setImgError] = useState(false);

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

          <h1 className={styles.title}>Recuperar Contraseña</h1>
          <p className={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos un enlace de recuperación
          </p>
        </div>

        {error && <div className={styles.globalError}>{error}</div>}
        {success && ( <FeedbackModal message={success} onClose={() => { setSuccess(''); navigate('/login');}}/>)}

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@gmail.com"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
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
              disabled={!isFormValid}
            >
              Enviar
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