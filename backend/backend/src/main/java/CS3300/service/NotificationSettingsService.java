package CS3300.service;

import CS3300.schema.NotificationSettings;
import CS3300.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationSettingsService {

    @Autowired
    private NotificationSettingsRepository repository;

    @Autowired
    private EmailService emailService;

    // Fetch notification settings for a user
    public NotificationSettings getSettings(String userId) {
        return repository.findById(userId).orElseGet(() -> {
            NotificationSettings settings = new NotificationSettings();
            settings.setUserId(userId);
            settings.setDaysBefore(3);
            settings.setEnabled(true);
            settings.setMethod("Email");
            repository.save(settings);
            return settings;
        });
    }

    // Save notification settings for a user
    public void saveSettings(NotificationSettings settings) {
        try {
            repository.save(settings);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to save settings due to an internal error.");
        }
    }

    // Scheduler to send notifications
    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void sendScheduledNotifications() {
        List<NotificationSettings> allSettings = repository.findAll();

        for (NotificationSettings settings : allSettings) {
            if (settings.isEnabled()) {
                String userEmail = settings.getUserId();
                List<NotificationSettings.NotificationTime> times = settings.getTimes();

                for (NotificationSettings.NotificationTime time : times) {
                    try {
                        // Parse the time and compare it to the current time
                        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
                        LocalTime notificationTime = LocalTime.parse(
                                time.getTime() + " " + time.getPeriod(),
                                DateTimeFormatter.ofPattern("hh:mm a")
                        ).truncatedTo(ChronoUnit.MINUTES);

                        if (now.equals(notificationTime)) {
                            sendNotificationEmail(userEmail);
                        }
                    } catch (Exception e) {
                        System.err.println("Error processing notification for user " + userEmail + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    // Helper method to send notification emails
    private void sendNotificationEmail(String userEmail) {
        String subject = "Reminder Notification";
        String messageBody = String.format("Hello \"%s\",\n\nThis is a reminder that you have a task due soon! " +
                "Ensure you complete it on time.\n\nBest regards,\nTaskTrackr Notifications", userEmail);
        emailService.sendEmail(userEmail, subject, messageBody);
    }
}