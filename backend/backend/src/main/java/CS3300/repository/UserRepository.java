package CS3300.repository;

import CS3300.schema.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    // Find user by their email address
    Optional<User> findByEmail(String email);

    // Find a user by their userId
    Optional<User> findByUserId(String userId);

    // Find a user by their password reset token
    Optional<User> findByResetToken(String resetToken);

    // Retrieve all users whose reset token as expired
    List<User> findAllByResetTokenExpiryBefore(Date now);

    // Delete a user by their email address
    void deleteByEmail(String email);
}
