package CS3300.service;

import CS3300.repository.NotificationSettingsRepository;
import CS3300.schema.NotificationSettings;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationSettingsServiceTest {

    @Mock
    private NotificationSettingsRepository repository;

    @InjectMocks
    private NotificationSettingsService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getSettings_existingUser_returnsSettings() {
        // Arrange
        String userId = "user123";
        NotificationSettings mockSettings = new NotificationSettings();
        mockSettings.setUserId(userId);
        mockSettings.setDaysBefore(5);
        mockSettings.setEnabled(true);
        mockSettings.setMethod("SMS");

        when(repository.findById(userId)).thenReturn(Optional.of(mockSettings));

        // Act
        NotificationSettings result = service.getSettings(userId);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(5, result.getDaysBefore());
        assertEquals(true, result.isEnabled());
        assertEquals("SMS", result.getMethod());
        verify(repository, times(1)).findById(userId);
        verify(repository, never()).save(any());
    }

    @Test
    void getSettings_newUser_createsDefaultSettings() {
        // Arrange
        String userId = "user456";
        when(repository.findById(userId)).thenReturn(Optional.empty());

        // Act
        NotificationSettings result = service.getSettings(userId);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(3, result.getDaysBefore());
        assertEquals(true, result.isEnabled());
        assertEquals("Email", result.getMethod());

        ArgumentCaptor<NotificationSettings> captor = ArgumentCaptor.forClass(NotificationSettings.class);
        verify(repository, times(1)).save(captor.capture());
        NotificationSettings savedSettings = captor.getValue();

        assertEquals(userId, savedSettings.getUserId());
        assertEquals(3, savedSettings.getDaysBefore());
        assertEquals(true, savedSettings.isEnabled());
        assertEquals("Email", savedSettings.getMethod());
    }

    @Test
    void saveSettings_validSettings_savesSuccessfully() {
        // Arrange
        NotificationSettings settings = new NotificationSettings();
        settings.setUserId("user789");
        settings.setDaysBefore(7);
        settings.setEnabled(false);
        settings.setMethod("Push");

        // Act
        service.saveSettings(settings);

        // Assert
        verify(repository, times(1)).save(settings);
    }

    @Test
    void saveSettings_repositoryThrowsException_throwsRuntimeException() {
        // Arrange
        NotificationSettings settings = new NotificationSettings();
        settings.setUserId("user999");
        doThrow(new RuntimeException("Database error")).when(repository).save(settings);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> service.saveSettings(settings));
        assertEquals("Failed to save settings due to an internal error.", exception.getMessage());
        verify(repository, times(1)).save(settings);
    }
}
