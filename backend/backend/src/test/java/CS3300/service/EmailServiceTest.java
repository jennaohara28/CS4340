package CS3300.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    private JavaMailSender mailSender;
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        mailSender = Mockito.mock(JavaMailSender.class);
        emailService = new EmailService();
        emailService.mailSender = mailSender; // Inject the mock mail sender
    }

    @Test
    void testSendEmail_Success() {
        String to = "jennagutier9@gmail.com";
        String subject = "Test Subject";
        String messageBody = "Test Body";

        // Capture the sent message
        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // Call the service method
        emailService.sendEmail(to, subject, messageBody);

        // Verify that mailSender.send() was called exactly once
        verify(mailSender, times(1)).send(messageCaptor.capture());

        // Retrieve the captured message
        SimpleMailMessage capturedMessage = messageCaptor.getValue();

        // Validate the email contents
        assertNotNull(capturedMessage, "The sent message should not be null");
        assertEquals(to, capturedMessage.getTo()[0], "Recipient email should match");
        assertEquals(subject, capturedMessage.getSubject(), "Email subject should match");
        assertEquals(messageBody, capturedMessage.getText(), "Email body should match");
        assertEquals("tasktrackr.notifications@gmail.com", capturedMessage.getFrom(), "Sender email should match");
    }

    @Test
    void testSendEmail_Failure() {
        String to = "recipient@example.com";
        String subject = "Test Subject";
        String messageBody = "Test Body";

        // Simulate a failure when sending the email
        doThrow(new RuntimeException("Mail server error")).when(mailSender).send(any(SimpleMailMessage.class));

        // Call the service method and ensure no exception is thrown
        assertDoesNotThrow(() -> emailService.sendEmail(to, subject, messageBody),
                "Email service should handle exceptions gracefully");

        // Verify that mailSender.send() was called
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
