import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Ship } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import styles from '../ForgotPassword/ForgotPassword.module.css'; // Mismo estilo base

export const ResetPasswordPlaceholder: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Opcional: asegurarnos de que viene un jwt desde la verificación de token.
  // const jwtToken = location.state?.token;

  return (
    <div className={styles.container}>
      <button className={styles.themeToggle} onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <Ship size={60} />
          <h1 className={styles.title}>Nueva Contraseña</h1>
          <p className={styles.subtitle}>
            Ingresa tu nueva contraseña para acceder a la plataforma.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          (Siguiente User Story: Formulario de Restablecimiento)
        </div>

        <div className={styles.actions}>
          <button 
            type="button" 
            className="w-full"
            style={{ 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              background: 'var(--bg-card)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)', 
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/login')}
          >
            Volver
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        Sistema de Gestión Marítima V.1
      </div>
    </div>
  );
};
