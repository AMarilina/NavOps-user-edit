import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { LogOut } from 'lucide-react';

export const DashboardPlaceholder: React.FC = () => {
  const navigate = useNavigate();
  // Decode role from simple storage for this placeholder
  const rawRole = localStorage.getItem('navops_role') || 'Usuario';
  
  // Format the role text
  let roleDisplayName = rawRole;
  if(rawRole === 'ROLE_ADMIN') roleDisplayName = 'Administrador';
  if(rawRole === 'ROLE_CREW') roleDisplayName = 'Navegación / Flota';
  if(rawRole === 'ROLE_OFFICE') roleDisplayName = 'Operaciones';

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('navops_role');
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
        ¡Bienvenido al rol: {roleDisplayName}!
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Has iniciado sesión correctamente. Este es un placeholder.
      </p>
      <div style={{ width: '200px' }}>
        <Button onClick={handleLogout} variant="outline" icon={<LogOut size={18} />}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};
