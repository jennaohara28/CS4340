package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.service.PasswordService;
import CS3300.service.EmailService;
import CS3300.service.AppConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AppConfigService appConfigService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("{\"message\": \"Email already in use\"}");
        }
        user.setUserId(UUID.randomUUID().toString());
        user.setPassword(passwordService.hashPassword(user.getPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok("{\"userId\": \"" + user.getUserId() + "\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> existingUserOpt = userService.findByEmail(user.getEmail());
        if (!existingUserOpt.isPresent() || !passwordService.checkPassword(user.getPassword(), existingUserOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid email or password\"}");
        }
        User existingUser = existingUserOpt.get();
        return ResponseEntity.ok("{\"email\": \"" + existingUser.getEmail() + "\", \"userId\": \"" + existingUser.getUserId() + "\"}");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userService.findByEmail(email);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email address not found.");
        }

        User user = userOpt.get();

        // Generate a password reset token
        String resetToken = passwordService.generateResetToken();
        long expiryDuration = 15 * 60 * 1000;
        Date expiryDate = new Date(System.currentTimeMillis() + expiryDuration);

        // Store the token and expiry timestamp
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiryDate);
        userService.saveUser(user);

        // Construct a detailed email body
        String resetLink = appConfigService.getFrontendUrl() + "/reset-password?token=" + resetToken;
        String messageBody = "Hi " + user.getEmail() + ",\n\n" +
                "We received a request to reset your password. Please use the link below to reset your password. " +
                "This link will expire in 15 minutes.\n\n" +
                resetLink + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best Regards,\nTaskTrackr Team";

        // Send email with the detailed body
        try {
            emailService.sendEmail(user.getEmail(), "Password Reset Request", messageBody);
            logger.info("Password reset link sent to: {}", email);
            return ResponseEntity.ok("Password reset link sent.");
        } catch (Exception e) {
            logger.error("Failed to send password reset email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send password reset email.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userService.findByResetToken(token);

        if (!userOpt.isPresent()) {
            logger.warn("Invalid or expired reset token used.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired reset token.");
        }

        User user = userOpt.get();

        // Check if the token has expired
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().before(new Date())) {
            logger.warn("Reset token expired for user: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reset token has expired.");
        }

        // Update the user's password and clear the reset token
        user.setPassword(passwordService.hashPassword(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userService.saveUser(user);

        logger.info("Password reset successfully for user: {}", user.getEmail());
        return ResponseEntity.ok("Password reset successful.");
    }

    @GetMapping("/test-email")
    public ResponseEntity<?> testEmail() {
        try {
            emailService.sendEmail("test@example.com", "Test Subject", "This is a test email.");
            return ResponseEntity.ok(Collections.singletonMap("message", "Test email sent successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Failed to send test email: " + e.getMessage()));
        }
    }
}
