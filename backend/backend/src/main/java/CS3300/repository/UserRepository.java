package CS3300.repository;

import CS3300.schema.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);

    // Method to find all users with expired tokens
    List<User> findAllByResetTokenExpiryBefore(Date now);
}


