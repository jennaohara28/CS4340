package CS3300.schema;

import javax.persistence.*;
import java.util.List;

@Entity
public class NotificationSettings {

    @Id
    private String userId;

    private int daysBefore;
    private boolean enabled;
    private String method;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "notification_times", joinColumns = @JoinColumn(name = "user_id"))
    private List<NotificationTime> times;

    @Embeddable
    public static class NotificationTime {
        private String time;
        private String period;

        // Getters and setters
        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        @Override
        public String toString() {
            return "NotificationTime{" +
                    "time='" + time + '\'' +
                    ", period='" + period + '\'' +
                    '}';
        }
    }

    // Getters and setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getDaysBefore() {
        return daysBefore;
    }

    public void setDaysBefore(int daysBefore) {
        this.daysBefore = daysBefore;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public List<NotificationTime> getTimes() {
        return times;
    }

    public void setTimes(List<NotificationTime> times) {
        this.times = times;
    }
}
