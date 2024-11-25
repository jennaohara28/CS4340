package CS3300.schema;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;
    private String password;
    private String resetToken;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reset_token_expiry")
    private Date resetTokenExpiry;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Date getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(Date resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
