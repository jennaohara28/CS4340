package CS3300.schema;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    @Test
    void testDefaultConstructor() {
        Task task = new Task();

        assertNull(task.getId(), "Default constructor should initialize id to null");
        assertNull(task.getName(), "Default constructor should initialize name to null");
        assertNull(task.getType(), "Default constructor should initialize type to null");
        assertEquals(0, task.getTimeAll(), "Default constructor should initialize timeAll to 0");
        assertNull(task.getStatus(), "Default constructor should initialize status to null");
        assertNull(task.getDueDate(), "Default constructor should initialize dueDate to null");
        assertEquals(0, task.getPriority(), "Default constructor should initialize priority to 0");
        assertNull(task.getOwnerId(), "Default constructor should initialize ownerId to null");
        assertNull(task.getClassId(), "Default constructor should initialize classId to null");
    }

    @Test
    void testParameterizedConstructor() {
        String name = "Homework";
        String type = "Assignment";
        LocalDate dueDate = LocalDate.of(2024, 12, 15);

        Task task = new Task(name, type, dueDate);

        assertNull(task.getId(), "Id should be null for a new entity");
        assertEquals(name, task.getName(), "Name should match the value passed to the constructor");
        assertEquals(type, task.getType(), "Type should match the value passed to the constructor");
        assertEquals(dueDate, task.getDueDate(), "DueDate should match the value passed to the constructor");
        assertEquals(0, task.getTimeAll(), "TimeAll should be initialized to 0");
        assertNull(task.getStatus(), "Status should be null by default");
        assertEquals(0, task.getPriority(), "Priority should be initialized to 0");
        assertNull(task.getOwnerId(), "OwnerId should be null by default");
        assertNull(task.getClassId(), "ClassId should be null by default");
    }

    @Test
    void testSettersAndGetters() {
        Task task = new Task();

        Long id = 1L;
        String name = "Project";
        String type = "Research";
        int timeAll = 120;
        String status = "In Progress";
        LocalDate dueDate = LocalDate.of(2024, 11, 30);
        int priority = 3;
        String ownerId = "user123";
        Long classId = 101L;

        task.setId(id);
        task.setName(name);
        task.setType(type);
        task.setTimeAll(timeAll);
        task.setStatus(status);
        task.setDueDate(dueDate);
        task.setPriority(priority);
        task.setOwnerId(ownerId);
        task.setClassId(classId);

        assertEquals(id, task.getId(), "Getter and setter for id should work");
        assertEquals(name, task.getName(), "Getter and setter for name should work");
        assertEquals(type, task.getType(), "Getter and setter for type should work");
        assertEquals(timeAll, task.getTimeAll(), "Getter and setter for timeAll should work");
        assertEquals(status, task.getStatus(), "Getter and setter for status should work");
        assertEquals(dueDate, task.getDueDate(), "Getter and setter for dueDate should work");
        assertEquals(priority, task.getPriority(), "Getter and setter for priority should work");
        assertEquals(ownerId, task.getOwnerId(), "Getter and setter for ownerId should work");
        assertEquals(classId, task.getClassId(), "Getter and setter for classId should work");
    }

    @Test
    void testPriorityBounds() {
        Task task = new Task();

        int validPriority = 5;
        task.setPriority(validPriority);
        assertEquals(validPriority, task.getPriority(), "Priority should accept valid values");

        int invalidPriority = -1;
        task.setPriority(invalidPriority);
        assertEquals(invalidPriority, task.getPriority(), "Priority setter does not enforce bounds; test implementation behavior");
    }
}
