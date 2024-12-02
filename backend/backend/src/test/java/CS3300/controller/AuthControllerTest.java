package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.service.PasswordService;
import CS3300.service.EmailService;
import CS3300.service.AppConfigService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UserService userService;

    @Mock
    private PasswordService passwordService;

    @Mock
    private EmailService emailService;

    @Mock
    private AppConfigService appConfigService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testRegisterUserEmailAlreadyExists() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        ResponseEntity<?> response = authController.register(user);

        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Email already in use"));
    }

    @Test
    void testLoginSuccess() {
        User existingUser = new User();
        existingUser.setEmail("test@example.com");
        existingUser.setPassword("hashedPassword");
        existingUser.setUserId("123");

        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordService.checkPassword("password123", "hashedPassword")).thenReturn(true);

        User loginUser = new User();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("password123");

        ResponseEntity<?> response = authController.login(loginUser);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("\"email\""));
    }

    @Test
    void testLoginInvalidCredentials() {
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.empty());

        User loginUser = new User();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("password123");

        ResponseEntity<?> response = authController.login(loginUser);

        assertEquals(401, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Invalid email or password"));
    }

    @Test
    void testForgotPasswordSuccess() {
        User user = new User();
        user.setEmail("test@example.com");
        when(userService.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordService.generateResetToken()).thenReturn("resetToken");
        when(appConfigService.getFrontendUrl()).thenReturn("http://localhost:3000");

        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        Map<String, String> request = new HashMap<>();
        request.put("email", "test@example.com");

        ResponseEntity<?> response = authController.forgotPassword(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Password reset link sent.", response.getBody());
        verify(emailService).sendEmail(eq("test@example.com"), anyString(), contains("resetToken"));
    }

    @Test
    void testForgotPasswordEmailNotFound() {
        when(userService.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        Map<String, String> request = new HashMap<>();
        request.put("email", "unknown@example.com");

        ResponseEntity<?> response = authController.forgotPassword(request);

        assertEquals(404, response.getStatusCodeValue());
        assertEquals("Email address not found.", response.getBody());
    }

    @Test
    void testResetPasswordInvalidToken() {
        when(userService.findByResetToken("invalidToken")).thenReturn(Optional.empty());

        Map<String, String> request = new HashMap<>();
        request.put("token", "invalidToken");
        request.put("newPassword", "newPassword");

        ResponseEntity<?> response = authController.resetPassword(request);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Invalid or expired reset token.", response.getBody());
    }

    @Test
    void testTestEmailSuccess() {
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        ResponseEntity<?> response = authController.testEmail();

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Test email sent successfully"));
        verify(emailService).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    void testTestEmailFailure() {
        doThrow(new RuntimeException("Email service failed")).when(emailService).sendEmail(anyString(), anyString(), anyString());

        ResponseEntity<?> response = authController.testEmail();

        assertEquals(500, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Failed to send test email"));
    }
}
