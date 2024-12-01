package CS3300.schema;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NotificationSettingsTest {

    @Test
    void testDefaultValues() {
        NotificationSettings settings = new NotificationSettings();

        assertNull(settings.getUserId(), "Default userId should be null");
        assertEquals(0, settings.getDaysBefore(), "Default daysBefore should be 0");
        assertFalse(settings.isEnabled(), "Default enabled value should be false");
        assertNull(settings.getMethod(), "Default method should be null");
        assertNull(settings.getUserId(), "Default user reference should be null");
        assertNull(settings.getTimes(), "Default times list should be null");
    }

    @Test
    void testSettersAndGetters() {
        NotificationSettings settings = new NotificationSettings();

        String userId = "user123";
        int daysBefore = 5;
        boolean enabled = true;
        String method = "email";

        settings.setUserId(userId);
        settings.setDaysBefore(daysBefore);
        settings.setEnabled(enabled);
        settings.setMethod(method);

        assertEquals(userId, settings.getUserId(), "Getter and setter for userId should work");
        assertEquals(daysBefore, settings.getDaysBefore(), "Getter and setter for daysBefore should work");
        assertTrue(settings.isEnabled(), "Getter and setter for enabled should work");
        assertEquals(method, settings.getMethod(), "Getter and setter for method should work");
    }

    @Test
    void testNotificationTimeEmbeddedClass() {
        NotificationSettings.NotificationTime time = new NotificationSettings.NotificationTime();

        String timeValue = "10:00";
        String period = "AM";

        time.setTime(timeValue);
        time.setPeriod(period);

        assertEquals(timeValue, time.getTime(), "Getter and setter for time in NotificationTime should work");
        assertEquals(period, time.getPeriod(), "Getter and setter for period in NotificationTime should work");
    }

    @Test
    void testTimesList() {
        NotificationSettings settings = new NotificationSettings();
        List<NotificationSettings.NotificationTime> times = new ArrayList<>();

        NotificationSettings.NotificationTime time1 = new NotificationSettings.NotificationTime();
        time1.setTime("08:00");
        time1.setPeriod("AM");

        NotificationSettings.NotificationTime time2 = new NotificationSettings.NotificationTime();
        time2.setTime("02:00");
        time2.setPeriod("PM");

        times.add(time1);
        times.add(time2);

        settings.setTimes(times);

        assertNotNull(settings.getTimes(), "Times list should not be null after being set");
        assertEquals(2, settings.getTimes().size(), "Times list should have two elements");
        assertEquals("08:00", settings.getTimes().get(0).getTime(), "First time in list should match");
        assertEquals("PM", settings.getTimes().get(1).getPeriod(), "Second period in list should match");
    }
}
