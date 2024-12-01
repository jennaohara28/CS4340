package CS3300.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PasswordServiceTest {

    private PasswordService passwordService;
    private BCryptPasswordEncoder mockPasswordEncoder;

    @BeforeEach
    void setUp() {
        mockPasswordEncoder = mock(BCryptPasswordEncoder.class);
        passwordService = new PasswordService() {
            @Override
            public String hashPassword(String plainPassword) {
                return mockPasswordEncoder.encode(plainPassword);
            }

            @Override
            public boolean checkPassword(String plainPassword, String hashedPassword) {
                return mockPasswordEncoder.matches(plainPassword, hashedPassword);
            }
        };
    }

    @Test
    void hashPassword_generatesHashedPassword() {
        // Arrange
        String plainPassword = "mySecurePassword";
        String expectedHash = "$2a$10$abcdefg12345678";
        when(mockPasswordEncoder.encode(plainPassword)).thenReturn(expectedHash);

        // Act
        String result = passwordService.hashPassword(plainPassword);

        // Assert
        assertNotNull(result);
        assertEquals(expectedHash, result);
        verify(mockPasswordEncoder, times(1)).encode(plainPassword);
    }

    @Test
    void checkPassword_correctPassword_returnsTrue() {
        // Arrange
        String plainPassword = "mySecurePassword";
        String hashedPassword = "$2a$10$abcdefg12345678";
        when(mockPasswordEncoder.matches(plainPassword, hashedPassword)).thenReturn(true);

        // Act
        boolean result = passwordService.checkPassword(plainPassword, hashedPassword);

        // Assert
        assertTrue(result);
        verify(mockPasswordEncoder, times(1)).matches(plainPassword, hashedPassword);
    }

    @Test
    void checkPassword_incorrectPassword_returnsFalse() {
        // Arrange
        String plainPassword = "mySecurePassword";
        String hashedPassword = "$2a$10$abcdefg12345678";
        when(mockPasswordEncoder.matches(plainPassword, hashedPassword)).thenReturn(false);

        // Act
        boolean result = passwordService.checkPassword(plainPassword, hashedPassword);

        // Assert
        assertFalse(result);
        verify(mockPasswordEncoder, times(1)).matches(plainPassword, hashedPassword);
    }

    @Test
    void generateResetToken_returnsNonEmptyString() {
        // Act
        String result = passwordService.generateResetToken();

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertDoesNotThrow(() -> UUID.fromString(result)); // Ensure it is a valid UUID
    }
}
