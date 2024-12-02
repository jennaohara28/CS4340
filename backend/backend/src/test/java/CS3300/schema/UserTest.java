package CS3300.schema;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testDefaultValues() {
        User user = new User();

        assertNull(user.getEmail(), "Default email should be null");
        assertNull(user.getUserId(), "Default userId should be null");
        assertNull(user.getName(), "Default name should be null");
        assertNull(user.getPassword(), "Default password should be null");
        assertNull(user.getResetToken(), "Default resetToken should be null");
        assertNull(user.getResetTokenExpiry(), "Default resetTokenExpiry should be null");
    }

    @Test
    void testSettersAndGetters() {
        User user = new User();

        String email = "test@example.com";
        String userId = "user123";
        String name = "John Doe";
        String password = "securePassword";
        String resetToken = "reset123";
        Date resetTokenExpiry = new Date();

        user.setEmail(email);
        user.setUserId(userId);
        user.setName(name);
        user.setPassword(password);
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(resetTokenExpiry);

        assertEquals(email, user.getEmail(), "Getter and setter for email should work");
        assertEquals(userId, user.getUserId(), "Getter and setter for userId should work");
        assertEquals(name, user.getName(), "Getter and setter for name should work");
        assertEquals(password, user.getPassword(), "Getter and setter for password should work");
        assertEquals(resetToken, user.getResetToken(), "Getter and setter for resetToken should work");
        assertEquals(resetTokenExpiry, user.getResetTokenExpiry(), "Getter and setter for resetTokenExpiry should work");
    }

    @Test
    void testResetTokenExpiryBehavior() {
        User user = new User();
        Date now = new Date();
        Date futureDate = new Date(System.currentTimeMillis() + 100000); // 100 seconds in the future

        user.setResetTokenExpiry(now);
        assertEquals(now, user.getResetTokenExpiry(), "ResetTokenExpiry should be set correctly");

        user.setResetTokenExpiry(futureDate);
        assertEquals(futureDate, user.getResetTokenExpiry(), "ResetTokenExpiry should allow future dates");
    }

    @Test
    void testUniqueFields() {
        User user1 = new User();
        User user2 = new User();

        String email1 = "user1@example.com";
        String email2 = "user2@example.com";

        String userId1 = "userId1";
        String userId2 = "userId2";

        user1.setEmail(email1);
        user1.setUserId(userId1);

        user2.setEmail(email2);
        user2.setUserId(userId2);

        assertNotEquals(user1.getEmail(), user2.getEmail(), "Emails should be unique");
        assertNotEquals(user1.getUserId(), user2.getUserId(), "User IDs should be unique");
    }
}

