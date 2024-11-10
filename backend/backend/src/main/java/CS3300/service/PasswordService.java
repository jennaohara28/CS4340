package CS3300.service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Random;

@Service
public class PasswordService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }

    public boolean checkPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }

    // Generate a random token for password reset
    public String generateResetToken() {
        int length = 32;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new SecureRandom();
        StringBuilder token = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            token.append(characters.charAt(random.nextInt(characters.length())));
        }
        return token.toString();
    }

}