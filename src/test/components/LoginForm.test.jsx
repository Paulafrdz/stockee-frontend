import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/loginForm/LoginForm';
import { AuthService } from '../../services/AuthService';

// Mock AuthService
vi.mock('../../services/AuthService', () => ({
  AuthService: {
    login: vi.fn()
  }
}));

// Wrapper component for Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnToggleMode = vi.fn();

  const defaultProps = {
    onSuccess: mockOnSuccess,
    onToggleMode: mockOnToggleMode
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering ====================

  it('should render login form with all essential elements', () => {
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    expect(screen.getByText('Regístrate gratis')).toBeInTheDocument();
  });

  // ==================== User Input ====================

  it('should update input fields when user types', async () => {
    const user = userEvent.setup();
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  // ==================== Form Validation ====================

  it('should not submit with empty fields', async () => {
    const user = userEvent.setup();
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.login).not.toHaveBeenCalled();
    });
  });

  it('should not submit with invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.login).not.toHaveBeenCalled();
    });
  });

  it('should not submit with password less than 6 characters', async () => {
    const user = userEvent.setup();
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '12345');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.login).not.toHaveBeenCalled();
    });
  });

  // ==================== Successful Submission ====================

  it('should submit with valid credentials and call onSuccess', async () => {
    const user = userEvent.setup();
    const mockUser = { 
      token: 'fake-token', 
      username: 'testuser',
      email: 'test@example.com'
    };
    AuthService.login.mockResolvedValue(mockUser);
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should disable button and show loading text while submitting', async () => {
    const user = userEvent.setup();
    AuthService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
  });

  // ==================== Error Handling ====================

  it('should display error message when login fails', async () => {
    const user = userEvent.setup();
    AuthService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should display server error message when available', async () => {
    const user = userEvent.setup();
    const serverError = {
      response: {
        data: {
          message: 'Usuario no encontrado'
        }
      }
    };
    AuthService.login.mockRejectedValue(serverError);
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Usuario no encontrado/i)).toBeInTheDocument();
    });
  });

  it('should re-enable button after error and clear error on retry', async () => {
    const user = userEvent.setup();
    AuthService.login
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ token: 'fake-token', username: 'testuser' });
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    // First submission - error
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/First error/i)).toBeInTheDocument();
    });
    
    expect(submitButton).not.toBeDisabled();
    
    // Second submission - success
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/First error/i)).not.toBeInTheDocument();
    });
  });

  // ==================== Toggle Mode ====================

  it('should call onToggleMode when register link is clicked', async () => {
    const user = userEvent.setup();
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const registerButton = screen.getByText('Regístrate gratis');
    await user.click(registerButton);
    
    expect(mockOnToggleMode).toHaveBeenCalledTimes(1);
    expect(AuthService.login).not.toHaveBeenCalled();
  });

  // ==================== Edge Cases ====================

  it('should trim whitespace from email', async () => {
    const user = userEvent.setup();
    AuthService.login.mockResolvedValue({ 
      token: 'fake-token', 
      username: 'testuser' 
    });
    
    render(
      <RouterWrapper>
        <LoginForm {...defaultProps} />
      </RouterWrapper>
    );
    
    const emailInput = screen.getByPlaceholderText('tu@email.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    await user.type(emailInput, '  test@example.com  ');
    await user.type(passwordInput, 'password123');
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
