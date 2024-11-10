package CS3300.service;

import CS3300.repository.UserRepository;
import CS3300.schema.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByResetToken(String resetToken) {
        return userRepository.findByResetToken(resetToken);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User registerUser(User user) {
        String hashedPassword = passwordService.hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
