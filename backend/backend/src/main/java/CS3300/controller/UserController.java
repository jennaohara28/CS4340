package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public void createUser(@RequestBody User user) {
        service.saveUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @Transactional
    @DeleteMapping("/delete-account/{userId}")
    public ResponseEntity<?> deleteAccount(@PathVariable String userId) {
        try {
            // Find user by userId
            Optional<User> userOptional = userRepository.findByUserId(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String email = user.getEmail();

                // Delete the user using their email (primary key)
                userRepository.deleteByEmail(email);

                return ResponseEntity.ok("{\"message\": \"Account deleted successfully.\"}");
            } else {
                System.out.println("User not found with userId: " + userId);
                return ResponseEntity.status(404).body("{\"message\": \"Account not found.\"}");
            }
        } catch (Exception e) {
            System.err.println("Error deleting user with userId: " + userId);
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"message\": \"An internal server error occurred.\"}");
        }
    }
}