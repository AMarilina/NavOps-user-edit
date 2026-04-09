import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { VerifyToken } from './VerifyToken';

// Mock del navigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { email: 'testqa@navops.com' }
    })
  };
});

globalThis.fetch = vi.fn();

describe('VerifyToken Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <VerifyToken />
      </MemoryRouter>
    );
  };

  it('renders 8 OTP inputs and disabled Valir button initially', () => {
    renderComponent();
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(8);
    
    const submitBtn = screen.getByRole('button', { name: /validar/i });
    expect(submitBtn).toBeDisabled();
    
    // Muestra el correo que recibio por URL state
    expect(screen.getByText('testqa@navops.com')).toBeInTheDocument();
  });

  it('enables the button when 8 characters are entered', async () => {
    renderComponent();
    const user = userEvent.setup();
    const inputs = screen.getAllByRole('textbox');
    const submitBtn = screen.getByRole('button', { name: /validar/i });

    for (let i = 0; i < 8; i++) {
        await user.type(inputs[i], 'A');
    }

    expect(submitBtn).toBeEnabled();
  });

  it('navigates to reset-password when token is valid', async () => {
    renderComponent();
    const user = userEvent.setup();
    
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        resetToken: 'jwt-123',
        message: 'Identidad validada exitosamente'
      }),
    });

    const inputs = screen.getAllByRole('textbox');
    for (let i = 0; i < 8; i++) {
        await user.type(inputs[i], 'A');
    }

    await user.click(screen.getByRole('button', { name: /validar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/reset-password', {
        state: { token: 'jwt-123', email: 'testqa@navops.com' }
      });
    });
  });

  it('shows error message when token is invalid or expired', async () => {
    renderComponent();
    const user = userEvent.setup();
    
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'El código ingresado no es válido o ha expirado',
        status: 400
      }),
    });

    const inputs = screen.getAllByRole('textbox');
    for (let i = 0; i < 8; i++) {
        await user.type(inputs[i], 'B');
    }

    await user.click(screen.getByRole('button', { name: /validar/i }));

    await waitFor(() => {
        expect(screen.getByText('El código ingresado no es válido o ha expirado')).toBeInTheDocument();
    });
  });

  it('calls forgot-password endpoint when resend button is clicked', async () => {
    renderComponent();
    const user = userEvent.setup();
    
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Se ha enviado un enlace a tu correo'
      }),
    });

    const resendBtn = screen.getByRole('button', { name: /reenviar código/i });
    await user.click(resendBtn);

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/forgot-password'), expect.objectContaining({
       method: 'POST',
       body: JSON.stringify({ email: 'testqa@navops.com' })
    }));

    await waitFor(() => {
       expect(screen.getByText('Te hemos enviado un nuevo código de verificación')).toBeInTheDocument();
    });
  });

});
