package CS3300.controller;

import CS3300.schema.NotificationSettings;
import CS3300.schema.NotificationSettings.NotificationTime;
import CS3300.service.NotificationSettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationSettingsControllerTest {

    @Mock
    private NotificationSettingsService service;

    @InjectMocks
    private NotificationSettingsController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetSettings() {
        String userId = "user123";

        // Mock notification times
        NotificationTime time1 = new NotificationTime();
        time1.setTime("08:00");
        time1.setPeriod("AM");

        NotificationTime time2 = new NotificationTime();
        time2.setTime("03:00");
        time2.setPeriod("PM");

        List<NotificationTime> times = Arrays.asList(time1, time2);

        // Mock notification settings
        NotificationSettings mockSettings = new NotificationSettings();
        mockSettings.setUserId(userId);
        mockSettings.setDaysBefore(3);
        mockSettings.setEnabled(true);
        mockSettings.setMethod("email");
        mockSettings.setTimes(times);

        when(service.getSettings(userId)).thenReturn(mockSettings);

        NotificationSettings result = controller.getSettings(userId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(3, result.getDaysBefore());
        assertTrue(result.isEnabled());
        assertEquals("email", result.getMethod());
        assertEquals(2, result.getTimes().size());
        assertEquals("08:00", result.getTimes().get(0).getTime());
        assertEquals("AM", result.getTimes().get(0).getPeriod());
        assertEquals("03:00", result.getTimes().get(1).getTime());
        assertEquals("PM", result.getTimes().get(1).getPeriod());

        verify(service, times(1)).getSettings(userId);
    }

    @Test
    void testSaveSettings_Success() {
        NotificationTime time1 = new NotificationTime();
        time1.setTime("08:00");
        time1.setPeriod("AM");

        List<NotificationTime> times = Arrays.asList(time1);

        NotificationSettings settings = new NotificationSettings();
        settings.setUserId("user123");
        settings.setDaysBefore(2);
        settings.setEnabled(true);
        settings.setMethod("sms");
        settings.setTimes(times);

        doNothing().when(service).saveSettings(settings);

        ResponseEntity<String> response = controller.saveSettings(settings);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Settings saved successfully!", response.getBody());
        verify(service, times(1)).saveSettings(settings);
    }

    @Test
    void testSaveSettings_Failure() {
        NotificationTime time1 = new NotificationTime();
        time1.setTime("09:00");
        time1.setPeriod("PM");

        List<NotificationTime> times = Arrays.asList(time1);

        NotificationSettings settings = new NotificationSettings();
        settings.setUserId("user456");
        settings.setDaysBefore(5);
        settings.setEnabled(false);
        settings.setMethod("push");
        settings.setTimes(times);

        doThrow(new RuntimeException("Database error")).when(service).saveSettings(settings);

        ResponseEntity<String> response = controller.saveSettings(settings);

        assertEquals(500, response.getStatusCodeValue());
        assertEquals("Internal Server Error", response.getBody());
        verify(service, times(1)).saveSettings(settings);
    }
}
