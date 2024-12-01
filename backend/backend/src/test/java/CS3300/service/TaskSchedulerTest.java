package CS3300.service;

import CS3300.schema.NotificationSettings;
import CS3300.schema.Task;
import CS3300.schema.User;
import CS3300.repository.TaskRepository;
import CS3300.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

class TaskSchedulerTest {

    private TaskScheduler taskScheduler;
    private EmailService emailService;
    private NotificationSettingsService notificationSettingsService;
    private TaskRepository taskRepository;
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        emailService = mock(EmailService.class);
        notificationSettingsService = mock(NotificationSettingsService.class);
        taskRepository = mock(TaskRepository.class);
        userRepository = mock(UserRepository.class);

        taskScheduler = new TaskScheduler();
        taskScheduler.emailService = emailService;
        taskScheduler.notificationSettingsService = notificationSettingsService;
        taskScheduler.taskRepository = taskRepository;
        taskScheduler.userRepository = userRepository;
    }

    @Test
    void sendTaskReminders_sendsEmailWhenConditionsAreMet() {
        // Arrange
        LocalDate today = LocalDate.now();
        Task task = new Task();
        task.setName("Test Task");
        task.setDueDate(today.plusDays(3));
        task.setOwnerId("user123");

        NotificationSettings settings = new NotificationSettings();
        settings.setEnabled(true);
        settings.setDaysBefore(3);

        User user = new User();
        user.setEmail("user@example.com");

        when(taskRepository.findAll()).thenReturn(List.of(task));
        when(notificationSettingsService.getSettings("user123")).thenReturn(settings);
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));

        // Act
        taskScheduler.sendTaskReminders();

        // Assert
        verify(emailService, times(1)).sendEmail(
                eq("user@example.com"),
                eq("Task Reminder"),
                eq("Your task 'Test Task' is due in 3 days.")
        );
    }

    @Test
    void sendTaskReminders_doesNotSendEmailIfNotificationsAreDisabled() {
        // Arrange
        LocalDate today = LocalDate.now();
        Task task = new Task();
        task.setName("Test Task");
        task.setDueDate(today.plusDays(3));
        task.setOwnerId("user123");

        NotificationSettings settings = new NotificationSettings();
        settings.setEnabled(false);

        when(taskRepository.findAll()).thenReturn(List.of(task));
        when(notificationSettingsService.getSettings("user123")).thenReturn(settings);

        // Act
        taskScheduler.sendTaskReminders();

        // Assert
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    void sendTaskReminders_doesNotSendEmailIfDueDateDoesNotMatch() {
        // Arrange
        LocalDate today = LocalDate.now();
        Task task = new Task();
        task.setName("Test Task");
        task.setDueDate(today.plusDays(5)); // Does not match `daysBefore`
        task.setOwnerId("user123");

        NotificationSettings settings = new NotificationSettings();
        settings.setEnabled(true);
        settings.setDaysBefore(3);

        when(taskRepository.findAll()).thenReturn(List.of(task));
        when(notificationSettingsService.getSettings("user123")).thenReturn(settings);

        // Act
        taskScheduler.sendTaskReminders();

        // Assert
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    void sendTaskReminders_doesNotSendEmailIfUserEmailIsNull() {
        // Arrange
        LocalDate today = LocalDate.now();
        Task task = new Task();
        task.setName("Test Task");
        task.setDueDate(today.plusDays(3));
        task.setOwnerId("user123");

        NotificationSettings settings = new NotificationSettings();
        settings.setEnabled(true);
        settings.setDaysBefore(3);

        when(taskRepository.findAll()).thenReturn(List.of(task));
        when(notificationSettingsService.getSettings("user123")).thenReturn(settings);
        when(userRepository.findById("user123")).thenReturn(Optional.empty()); // No email found

        // Act
        taskScheduler.sendTaskReminders();

        // Assert
        verify(emailService, never()).sendEmail(anyString(), anyString(), anyString());
    }
}
