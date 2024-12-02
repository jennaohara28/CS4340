package CS3300.controller;

import CS3300.schema.NotificationSettings;
import CS3300.service.NotificationSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification-settings")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationSettingsController {

    @Autowired
    private NotificationSettingsService service;

    @GetMapping("/{userId}")
    public NotificationSettings getSettings(@PathVariable String userId) {
        return service.getSettings(userId);
    }

    @PostMapping
    public ResponseEntity<String> saveSettings(@RequestBody NotificationSettings settings) {
        try {
            service.saveSettings(settings);
            return ResponseEntity.ok("Settings saved successfully!");
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }
}
