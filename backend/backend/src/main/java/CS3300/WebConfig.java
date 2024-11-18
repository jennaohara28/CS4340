package CS3300;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Fetch ALLOWED_ORIGINS from environment variable
        String allowedOrigins = System.getenv("ALLOWED_ORIGINS");

        // Provide a default value if ALLOWED_ORIGINS is not set
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            allowedOrigins = "http://localhost:4200";
        }

        // Split the allowed origins and register them
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
