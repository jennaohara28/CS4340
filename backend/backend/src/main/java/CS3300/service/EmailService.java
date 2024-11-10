package CS3300.service;

import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String to, String resetLink) throws EmailException {
        // Create the email message
        HtmlEmail email = new HtmlEmail();
        email.setHostName("smtp.your-email-provider.com"); // Set your SMTP server
        email.setSmtpPort(587); // Commonly used port for TLS
        email.setAuthentication("your-email@example.com", "your-email-password");
        email.setStartTLSEnabled(true); // Enable TLS

        email.setFrom("no-reply@yourapp.com"); // Set the sender
        email.setSubject("Password Reset Request");

        // Construct HTML message with the reset link
        String htmlMsg = "<p>Click the link below to reset your password:</p>"
                + "<a href=\"" + resetLink + "\">Reset Password</a>";
        email.setHtmlMsg(htmlMsg);

        // Set the recipient
        email.addTo(to);

        // Send the email
        email.send();
    }
}
