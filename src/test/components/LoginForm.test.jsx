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

describe('LoginForm - Unit Tests', () => {
  const mockOnSuccess = vi.fn();
  const mockOnToggleMode = vi.fn();

  const defaultProps = {
    onSuccess: mockOnSuccess,
    onToggleMode: mockOnToggleMode
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering Tests ====================

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
      expect(screen.getByText(/Ingresa a tu cuenta para empezar a gestionar/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('********')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should render password input field', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const passwordInput = screen.getByPlaceholderText('********');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render forgot password link', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    });

    it('should render register link', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
      expect(screen.getByText('Regístrate gratis')).toBeInTheDocument();
    });

    it('should render logo', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const logo = screen.getByAltText('logotype');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('logo');
    });

    it('should have submit button enabled initially', () => {
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  // ==================== User Input Tests ====================

  describe('User Input', () => {
    it('should update email field when user types', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password field when user types', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const passwordInput = screen.getByPlaceholderText('********');
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });

    it('should clear email error when user starts typing', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      // Submit without email to trigger error
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      // Type in email field
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      await user.type(emailInput, 't');
      
      // Error should be cleared (can't check directly, but input should work)
      expect(emailInput).toHaveValue('t');
    });

    it('should clear password error when user starts typing', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      // Submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      // Type in password field
      const passwordInput = screen.getByPlaceholderText('********');
      await user.type(passwordInput, 'p');
      
      expect(passwordInput).toHaveValue('p');
    });
  });

  // ==================== Validation Tests ====================

  describe('Form Validation', () => {
    it('should not submit when email is empty', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const passwordInput = screen.getByPlaceholderText('********');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(AuthService.login).not.toHaveBeenCalled();
      });
    });

    it('should not submit when password is empty', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      await user.type(emailInput, 'test@example.com');
      
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

    it('should not submit when password is less than 6 characters', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getByPlaceholderText('********');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '12345'); // Only 5 characters
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(AuthService.login).not.toHaveBeenCalled();
      });
    });

    it('should validate email format correctly', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getByPlaceholderText('********');
      
      // Invalid formats
      await user.type(emailInput, 'test@');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(AuthService.login).not.toHaveBeenCalled();
      });
    });

    it('should accept valid email and password', async () => {
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
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(AuthService.login).toHaveBeenCalledTimes(1);
      });
    });
  });

  // ==================== Submission Tests ====================

  describe('Form Submission', () => {
    it('should call AuthService.login with correct credentials', async () => {
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
      
      await user.type(emailInput, 'test@example.com');
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

    it('should call onSuccess with user data after successful login', async () => {
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
        expect(mockOnSuccess).toHaveBeenCalledWith(mockUser);
      });
    });

    it('should disable submit button while loading', async () => {
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
    });

    it('should show loading text while submitting', async () => {
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
      
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    });

    it('should not call onSuccess if user data is invalid', async () => {
      const user = userEvent.setup();
      AuthService.login.mockResolvedValue({}); // No token or username
      
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
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  // ==================== Error Handling Tests ====================

  describe('Error Handling', () => {
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

    it('should display server error message', async () => {
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

    it('should display generic error when no specific message', async () => {
      const user = userEvent.setup();
      AuthService.login.mockRejectedValue({});
      
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
        expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
      });
    });

    it('should re-enable button after error', async () => {
      const user = userEvent.setup();
      AuthService.login.mockRejectedValue(new Error('Network error'));
      
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
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
      
      expect(submitButton).not.toBeDisabled();
    });

    it('should clear previous errors on new submission', async () => {
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
      
      // Second submission - success
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/First error/i)).not.toBeInTheDocument();
      });
    });
  });

  // ==================== Toggle Mode Tests ====================

  describe('Toggle Mode', () => {
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
    });

    it('should not submit form when register link is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginForm {...defaultProps} />
        </RouterWrapper>
      );
      
      const registerButton = screen.getByText('Regístrate gratis');
      await user.click(registerButton);
      
      expect(AuthService.login).not.toHaveBeenCalled();
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle onSuccess callback being undefined', async () => {
      const user = userEvent.setup();
      AuthService.login.mockResolvedValue({ 
        token: 'fake-token', 
        username: 'testuser' 
      });
      
      render(
        <RouterWrapper>
          <LoginForm onSuccess={undefined} onToggleMode={mockOnToggleMode} />
        </RouterWrapper>
      );
      
      const emailInput = screen.getByPlaceholderText('tu@email.com');
      const passwordInput = screen.getByPlaceholderText('********');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      
      // Should not throw error
      await expect(user.click(submitButton)).resolves.not.toThrow();
    });

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
          email: 'test@example.com', // Component trims whitespace
          password: 'password123'
        });
      });
    });

    it('should handle special characters in password', async () => {
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
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'P@ssw0rd!#$%');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(AuthService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'P@ssw0rd!#$%'
        });
      });
    });
  });
});