import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPassword } from '../ForgotPassword/ForgotPassword';

globalThis.fetch = vi.fn();

describe('ForgotPassword Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
  };

  it('renders correctly and button is disabled initially', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/correo/i);
    const submitBtn = screen.getByRole('button', { name: /enviar/i });

    expect(emailInput).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('enables button when email is valid', async () => {
    renderComponent();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/correo/i);
    const submitBtn = screen.getByRole('button', { name: /enviar/i });

    await user.type(emailInput, 'test@mail.com');

    expect(submitBtn).toBeEnabled();
  });

  it('shows success message when email is sent', async () => {
    renderComponent();
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Se ha enviado un enlace a tu correo electrónico'
      }),
    });

    await user.type(screen.getByLabelText(/correo/i), 'test@mail.com');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Se ha enviado un enlace a tu correo electrónico')
      ).toBeInTheDocument();
    });
  });

  it('shows error message when email does not exist', async () => {
    renderComponent();
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Email not found',
        status: 404
      }),
    });

    await user.type(screen.getByLabelText(/correo/i), 'notfound@mail.com');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

});