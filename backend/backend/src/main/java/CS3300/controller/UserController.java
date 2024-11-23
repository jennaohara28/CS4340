package CS3300.controller;

import CS3300.schema.User;
import CS3300.service.UserService;
import CS3300.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

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

    @DeleteMapping("/delete-account/{email}")
    public ResponseEntity<?> deleteAccount(@PathVariable String email) {
        userRepository.deleteById(email);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}