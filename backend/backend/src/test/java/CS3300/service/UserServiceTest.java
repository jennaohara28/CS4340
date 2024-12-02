package CS3300.service;

import CS3300.repository.UserRepository;
import CS3300.schema.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize user object for tests
        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setResetToken("resetToken");
    }

    @Test
    void testFindByEmail() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // When
        Optional<User> foundUser = userService.findByEmail("test@example.com");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("test@example.com", foundUser.get().getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testFindByEmail_UserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When
        Optional<User> foundUser = userService.findByEmail("nonexistent@example.com");

        // Then
        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findByEmail("nonexistent@example.com");
    }

    @Test
    void testFindByResetToken() {
        // Given
        when(userRepository.findByResetToken("resetToken")).thenReturn(Optional.of(user));

        // When
        Optional<User> foundUser = userService.findByResetToken("resetToken");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("resetToken", foundUser.get().getResetToken());
        verify(userRepository, times(1)).findByResetToken("resetToken");
    }

    @Test
    void testSaveUser() {
        // Given
        when(userRepository.save(user)).thenReturn(user);

        // When
        User savedUser = userService.saveUser(user);

        // Then
        assertNotNull(savedUser);
        assertEquals(user.getEmail(), savedUser.getEmail());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testRegisterUser() {
        // Given
        String rawPassword = "password"; // This is the password set in the user object
        String hashedPassword = "hashedPassword";

        // Mock the password hashing
        when(passwordService.hashPassword(rawPassword)).thenReturn(hashedPassword);

        // Mock the save method
        when(userRepository.save(user)).thenReturn(user);

        // When
        User registeredUser = userService.registerUser(user);

        // Then
        assertNotNull(registeredUser);
        assertEquals(hashedPassword, registeredUser.getPassword()); // Check if the password was hashed
        verify(passwordService, times(1)).hashPassword(rawPassword); // Verify the correct password was passed
        verify(userRepository, times(1)).save(user); // Ensure the save method was called once
    }


    @Test
    void testGetAllUsers() {
        // Given
        User user1 = new User();
        user1.setEmail("user1@example.com");
        User user2 = new User();
        user2.setEmail("user2@example.com");
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // When
        List<User> users = userService.getAllUsers();

        // Then
        assertEquals(2, users.size());
        assertEquals("user1@example.com", users.get(0).getEmail());
        assertEquals("user2@example.com", users.get(1).getEmail());
        verify(userRepository, times(1)).findAll();
    }
}
