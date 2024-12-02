package CS3300.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String hashPassword(String plainPassword) {
        String hashedPassword = passwordEncoder.encode(plainPassword);
        return hashedPassword;
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    // Generate a random token for password reset
    public String generateResetToken() {
        return UUID.randomUUID().toString();
    }


}
