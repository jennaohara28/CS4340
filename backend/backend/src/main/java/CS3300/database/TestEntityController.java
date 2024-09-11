package CS3300.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestEntityController {

    @Autowired
    private TestEntityService service;

    @PostMapping("/save")
    public ResponseEntity<String> saveEntity(@RequestParam String name) {
        service.saveTestEntity(name);
        return ResponseEntity.ok("Entity saved");
    }

    @GetMapping("/all")
    public ResponseEntity<List<TestEntity>> getAllEntities() {
        return ResponseEntity.ok(service.getAllEntities());
    }
}
