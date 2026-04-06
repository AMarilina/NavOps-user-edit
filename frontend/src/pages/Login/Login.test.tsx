import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Login } from './Login';

// Mock global fetch
globalThis.fetch = vi.fn();

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-mock">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders correctly and submit button is initially disabled', () => {
    renderLogin();
    
    expect(screen.getByRole('heading', { name: /NavOps/i })).toBeInTheDocument();
    
    // Check inputs exist
    expect(screen.getByRole('textbox', { name: /Usuario/i })).toBeInTheDocument();
    
    // El input tipo password a veces no es role='textbox', así que buscamos por Label text
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    expect(passwordInput).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /^Iniciar Sesión$/i });
    expect(submitBtn).toBeDisabled(); // Vacíos -> deshabilitado
  });

  it('enables the submit button when both fields have text', async () => {
    renderLogin();
    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitBtn = screen.getByRole('button', { name: /^Iniciar Sesión$/i });

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');

    expect(submitBtn).toBeEnabled();
  });

  it('shows error message on invalid credentials', async () => {
    renderLogin();
    const user = userEvent.setup();

    // Setup mock to fail
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Usuario o contraseña incorrectos', status: 401 }),
    });

    await user.type(screen.getByLabelText(/Usuario/i), 'admin');
    await user.type(screen.getByLabelText(/Contraseña/i), 'wrong');
    
    const submitBtn = screen.getByRole('button', { name: /^Iniciar Sesión$/i });
    await user.click(submitBtn);

    // The submit button must show loading text, if loading text is used, wait. 
    // Here we just wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
    });
  });

  it('navigates to dashboard and stores token on successful login', async () => {
    renderLogin();
    const user = userEvent.setup();

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.12345';
    
    // Setup mock response correctly
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: mockToken,
        role: 'ROLE_ADMIN',
      }),
    });

    await user.type(screen.getByLabelText(/Usuario/i), 'admin');
    await user.type(screen.getByLabelText(/Contraseña/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /^Iniciar Sesión$/i }));

    // Wait for redirect to dashboard
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-mock')).toBeInTheDocument();
    });

    // Check localStorage persistence
    expect(localStorage.getItem('auth_token')).toBe(mockToken);
    expect(localStorage.getItem('navops_role')).toBe('ROLE_ADMIN');
  });

});
