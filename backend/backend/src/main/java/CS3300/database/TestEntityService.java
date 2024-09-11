package CS3300.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestEntityService {

    @Autowired
    private TestEntityRepository repository;

    public void saveTestEntity(String name) {
        TestEntity entity = new TestEntity();
        entity.setName(name);
        repository.save(entity);
    }

    public List<TestEntity> getAllEntities() {
        return repository.findAll();
    }
}

