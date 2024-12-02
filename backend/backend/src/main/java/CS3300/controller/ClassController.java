package CS3300.controller;

import CS3300.schema.Class;
import CS3300.service.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping
    public List<Class> getAllClasses() {
        return classService.getAllClasses();
    }

    @GetMapping("/owner")
    public List<Class> getClassesByOwner(@RequestHeader("userId") String userId) {
        System.out.println("Received userId: " + userId);
        if (userId == null || userId.isEmpty()) {
            System.err.println("Unauthorized access: userId is missing or empty.");
            throw new RuntimeException("Unauthorized access: User not logged in");
        }
        return classService.getClassesByOwnerId(userId);
    }

    @PostMapping
    public Class createClass(@RequestBody Class classEntity, @RequestHeader("userId") String userId) {
        System.out.println("Creating class for userId: " + userId);
        if (userId == null || userId.isEmpty()) {
            throw new RuntimeException("Unauthorized access: User not logged in");
        }
        classEntity.setOwnerId(userId);
        return classService.saveClass(classEntity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Class> getClassById(@PathVariable Long id) {
        Optional<Class> classEntity = classService.getClassById(id);
        return classEntity.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Class> updateClass(@PathVariable Long id, @RequestBody Class classEntity) {
        Optional<Class> existingClass = classService.getClassById(id);
        if (existingClass.isPresent()) {
            classEntity.setId(id);
            return ResponseEntity.ok(classService.saveClass(classEntity));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        if (classService.getClassById(id).isPresent()) {
            classService.deleteClass(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
