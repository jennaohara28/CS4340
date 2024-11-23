package CS3300.service;

import CS3300.schema.NotificationSettings;
import CS3300.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationSettingsService {
    @Autowired
    private NotificationSettingsRepository repository;

    public NotificationSettings getSettings(String userId) {
        return repository.findById(userId).orElseGet(() -> {
            NotificationSettings settings = new NotificationSettings();
            settings.setUserId(userId);
            settings.setDaysBefore(3);
            settings.setEnabled(true);
            return repository.save(settings);
        });
    }

    public void saveSettings(NotificationSettings settings) {
        repository.save(settings);
    }
}
