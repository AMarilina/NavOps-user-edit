import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { token: 'jwt-dummy-123' }
    })
  };
});

globalThis.fetch = vi.fn();

describe('ResetPassword Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
  };

  it('renders form elements correctly', () => {
    renderComponent();
    expect(screen.getByText(/Restablecer contraseña/i)).toBeInTheDocument();

    const passInput = screen.getByLabelText(/Nueva Contraseña/i);
    expect(passInput).toHaveAttribute('type', 'password');

    const passwordInputs = [
    screen.getByLabelText(/Nueva Contraseña/i),
    screen.getByLabelText(/Repetir Contraseña/i),
    ];

    expect(passwordInputs).toHaveLength(2);
    expect(screen.getByLabelText(/Nueva Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repetir Contraseña/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /guardar/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows error if passwords do not match and prevents fetch', async () => {
    renderComponent();
    const user = userEvent.setup();

    const passInput = screen.getByLabelText(/Nueva Contraseña/i);
    const repInput = screen.getByLabelText(/Repetir Contraseña/i);

    await user.type(passInput, 'Safe_123*Pwd');
    await user.type(repInput, 'Different_123*Pwd');

    const submitBtn = screen.getByRole('button', { name: /guardar/i });
    expect(submitBtn).toBeEnabled();

    await user.click(submitBtn);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('shows error if password does not meet security policies', async () => {
    renderComponent();
    const user = userEvent.setup();

    const passInput = screen.getByLabelText(/Nueva Contraseña/i);
    const repInput = screen.getByLabelText(/Repetir Contraseña/i);

    // No special character and no uppercase
    await user.type(passInput, 'safe123pwd');
    await user.type(repInput, 'safe123pwd');

    const submitBtn = screen.getByRole('button', { name: /guardar/i });
    await user.click(submitBtn);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.getByText(/La contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
  });

  it('submits successfully and shows green check UI', async () => {
    renderComponent();
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Tu contraseña fue actualizada con éxito'
      })
    });

    const passInput = screen.getByLabelText(/Nueva Contraseña/i);
    const repInput = screen.getByLabelText(/Repetir Contraseña/i);

    await user.type(passInput, 'Safe_123*Pwd');
    await user.type(repInput, 'Safe_123*Pwd');

    const submitBtn = screen.getByRole('button', { name: /guardar/i });
    await user.click(submitBtn);

    await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/reset-password'), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ token: 'jwt-dummy-123', newPassword: 'Safe_123*Pwd' })
        }));
    });

    // Check successful screen
    await waitFor(() => {
       expect(screen.getByText('Tu contraseña fue actualizada con éxito')).toBeInTheDocument();
       expect(screen.getByRole('button', { name: /aceptar/i })).toBeInTheDocument();
    });

    // Click Aceptar redirects to /login
    await user.click(screen.getByRole('button', { name: /aceptar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

});
