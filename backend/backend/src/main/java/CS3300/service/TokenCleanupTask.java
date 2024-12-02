package CS3300.service;

import CS3300.repository.UserRepository;
import CS3300.schema.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.List;

@Component
public class TokenCleanupTask {

    @Autowired
    private UserRepository userRepository;

    // Every 24 hours
    @Scheduled(fixedRate = 86400000)
    public void cleanUpExpiredTokens() {
        Date now = new Date();
        List<User> usersWithExpiredTokens = userRepository.findAllByResetTokenExpiryBefore(now);

        for (User user : usersWithExpiredTokens) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
        }
    }
}
