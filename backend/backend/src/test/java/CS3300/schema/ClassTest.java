package CS3300.schema;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ClassTest {

    @Test
    void testDefaultConstructor() {
        Class aClass = new Class();
        assertNull(aClass.getId(), "Default constructor should initialize id to null");
        assertNull(aClass.getName(), "Default constructor should initialize name to null");
        assertNull(aClass.getOwnerId(), "Default constructor should initialize ownerId to null");
    }

    @Test
    void testParameterizedConstructor() {
        String name = "Software Engineering";
        Class aClass = new Class(name);

        assertNull(aClass.getId(), "Id should be null for a new entity");
        assertEquals(name, aClass.getName(), "Name should match the value passed to the constructor");
        assertNull(aClass.getOwnerId(), "OwnerId should be null by default");
    }

    @Test
    void testSettersAndGetters() {
        Class aClass = new Class();

        Long id = 1L;
        String name = "Algorithms";
        String ownerId = "user123";

        aClass.setId(id);
        aClass.setName(name);
        aClass.setOwnerId(ownerId);

        assertEquals(id, aClass.getId(), "Setter and getter for id should work correctly");
        assertEquals(name, aClass.getName(), "Setter and getter for name should work correctly");
        assertEquals(ownerId, aClass.getOwnerId(), "Setter and getter for ownerId should work correctly");
    }
}
