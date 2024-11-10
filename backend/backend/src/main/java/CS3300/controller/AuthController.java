package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.service.PasswordService;
import CS3300.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.mail.EmailException;
import java.util.Map;
import java.util.Optional;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("Email already in use: {}", user.getEmail());
            return ResponseEntity.badRequest().body("Email already in use");
        }
        userService.registerUser(user);
        logger.info("User registered successfully: {}", user.getEmail());
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> existingUserOpt = userService.findByEmail(user.getEmail());
        if (existingUserOpt.isEmpty() || !passwordService.checkPassword(user.getPassword(), existingUserOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid email or password\"}");
        }
        User existingUser = existingUserOpt.get();
        return ResponseEntity.ok("{\"userId\": \"" + existingUser.getId() + "\"}");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isEmpty()) {
            logger.warn("Attempt to reset password for non-existent email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email address not found.");
        }

        User user = userOpt.get();

        // Generate a password reset token
        String resetToken = passwordService.generateResetToken();

        // Store the reset token in the user record
        user.setResetToken(resetToken);
        userService.saveUser(user);

        // Send email with the reset link
        String resetLink = "http://localhost:4200/reset-password?token=" + resetToken;
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            logger.info("Password reset link sent to: {}", email);
            return ResponseEntity.ok("Password reset link sent.");
        } catch (EmailException e) {
            logger.error("Failed to send password reset email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send password reset email.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userService.findByResetToken(token);

        if (userOpt.isEmpty()) {
            logger.warn("Invalid or expired reset token used.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired reset token.");
        }

        User user = userOpt.get();

        // Update the user's password and clear the reset token
        user.setPassword(passwordService.hashPassword(newPassword));
        user.setResetToken(null);
        userService.saveUser(user);

        logger.info("Password reset successfully for user: {}", user.getEmail());
        return ResponseEntity.ok("Password reset successful.");
    }
}
