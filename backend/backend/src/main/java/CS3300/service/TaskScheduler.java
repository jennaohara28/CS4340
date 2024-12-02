package CS3300.service;

import CS3300.schema.NotificationSettings;
import CS3300.schema.Task;
import CS3300.schema.User;
import CS3300.repository.TaskRepository;
import CS3300.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class TaskScheduler {
    @Autowired
    EmailService emailService;

    @Autowired
    NotificationSettingsService notificationSettingsService;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    @Scheduled(cron = "0 0 9 * * ?")
    public void sendTaskReminders() {
        LocalDate today = LocalDate.now();

        for (Task task : taskRepository.findAll()) {
            NotificationSettings settings = notificationSettingsService.getSettings(task.getOwnerId());
            String userEmail = userRepository.findById(task.getOwnerId())
                    .map(User::getEmail)
                    .orElse(null);

            if (settings.isEnabled() && userEmail != null &&
                    task.getDueDate().isEqual(today.plusDays(settings.getDaysBefore()))) {
                emailService.sendEmail(
                        userEmail,
                        "Task Reminder",
                        "Your task '" + task.getName() + "' is due in " + settings.getDaysBefore() + " days."
                );
            }
        }
    }
}
