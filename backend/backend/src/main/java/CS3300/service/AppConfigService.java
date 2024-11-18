package CS3300.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AppConfigService {
    @Value("${frontend.url}")
    private String frontendUrl;

    public String getFrontendUrl() {
        return frontendUrl;
    }
}
