package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        // Create a user instance to use in the test
        User user = new User();
        user.setUserId("user123");
        user.setEmail("test@example.com");

        // Mock the saveUser method to return the same user object when called
        when(userService.saveUser(any(User.class))).thenReturn(user);

        // Call the controller's createUser method
        userController.createUser(user);

        // Verify that saveUser was called exactly once with the correct user object
        verify(userService, times(1)).saveUser(user);
    }



    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setUserId("user123");
        user1.setEmail("test1@example.com");

        User user2 = new User();
        user2.setUserId("user456");
        user2.setEmail("test2@example.com");

        when(userService.getAllUsers()).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userController.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals("user123", users.get(0).getUserId());
        assertEquals("user456", users.get(1).getUserId());

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testDeleteAccount_Success() {
        String userId = "user123";

        User user = new User();
        user.setUserId(userId);
        user.setEmail("test@example.com");

        when(userRepository.findByUserId(userId)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).deleteByEmail(user.getEmail());

        ResponseEntity<?> response = userController.deleteAccount(userId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("{\"message\": \"Account deleted successfully.\"}", response.getBody());

        verify(userRepository, times(1)).findByUserId(userId);
        verify(userRepository, times(1)).deleteByEmail(user.getEmail());
    }

    @Test
    void testDeleteAccount_UserNotFound() {
        String userId = "user123";

        when(userRepository.findByUserId(userId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = userController.deleteAccount(userId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("{\"message\": \"Account not found.\"}", response.getBody());

        verify(userRepository, times(1)).findByUserId(userId);
        verify(userRepository, never()).deleteByEmail(anyString());
    }

    @Test
    void testDeleteAccount_InternalServerError() {
        String userId = "user123";

        when(userRepository.findByUserId(userId)).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<?> response = userController.deleteAccount(userId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is5xxServerError());
        assertEquals("{\"message\": \"An internal server error occurred.\"}", response.getBody());

        verify(userRepository, times(1)).findByUserId(userId);
        verify(userRepository, never()).deleteByEmail(anyString());
    }
}
