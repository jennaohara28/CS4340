package CS3300.controller;

import CS3300.schema.Task;
import CS3300.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTasks() {
        Task task1 = new Task();
        task1.setId(1L);
        task1.setName("Task 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setName("Task 2");

        when(taskService.getAllTasks()).thenReturn(Arrays.asList(task1, task2));

        List<Task> tasks = taskController.getAllTasks();

        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        assertEquals("Task 1", tasks.get(0).getName());
        assertEquals("Task 2", tasks.get(1).getName());

        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void testGetTasksByOwnerId() {
        String ownerId = "user123";

        Task task = new Task();
        task.setId(1L);
        task.setName("Task for owner");
        task.setOwnerId(ownerId);

        when(taskService.getTasksByOwnerId(ownerId)).thenReturn(Arrays.asList(task));

        List<Task> tasks = taskController.getTasksByOwnerId(ownerId);

        assertNotNull(tasks);
        assertEquals(1, tasks.size());
        assertEquals(ownerId, tasks.get(0).getOwnerId());
        assertEquals("Task for owner", tasks.get(0).getName());

        verify(taskService, times(1)).getTasksByOwnerId(ownerId);
    }

    @Test
    void testGetTasksByClassId() {
        Long classId = 10L;

        Task task = new Task();
        task.setId(1L);
        task.setName("Task for class");
        task.setClassId(classId);

        when(taskService.getTasksByClassId(classId)).thenReturn(Arrays.asList(task));

        List<Task> tasks = taskController.getTasksByClassId(classId);

        assertNotNull(tasks);
        assertEquals(1, tasks.size());
        assertEquals(classId, tasks.get(0).getClassId());
        assertEquals("Task for class", tasks.get(0).getName());

        verify(taskService, times(1)).getTasksByClassId(classId);
    }

    @Test
    void testGetTaskById_Found() {
        Long taskId = 1L;

        Task task = new Task();
        task.setId(taskId);
        task.setName("Task");

        when(taskService.getTaskById(taskId)).thenReturn(Optional.of(task));

        ResponseEntity<Task> response = taskController.getTaskById(taskId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(taskId, response.getBody().getId());
        assertEquals("Task", response.getBody().getName());

        verify(taskService, times(1)).getTaskById(taskId);
    }

    @Test
    void testGetTaskById_NotFound() {
        Long taskId = 2L;

        when(taskService.getTaskById(taskId)).thenReturn(Optional.empty());

        ResponseEntity<Task> response = taskController.getTaskById(taskId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is4xxClientError());
        assertNull(response.getBody());

        verify(taskService, times(1)).getTaskById(taskId);
    }

    @Test
    void testCreateTask() {
        Task task = new Task();
        task.setName("New Task");

        Task savedTask = new Task();
        savedTask.setId(1L);
        savedTask.setName("New Task");

        when(taskService.saveTask(task)).thenReturn(savedTask);

        Task result = taskController.createTask(task);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("New Task", result.getName());

        verify(taskService, times(1)).saveTask(task);
    }

    @Test
    void testUpdateTask_Found() {
        Long taskId = 1L;

        Task existingTask = new Task();
        existingTask.setId(taskId);
        existingTask.setName("Existing Task");

        Task updatedTask = new Task();
        updatedTask.setName("Updated Task");

        when(taskService.getTaskById(taskId)).thenReturn(Optional.of(existingTask));
        when(taskService.saveTask(updatedTask)).thenReturn(updatedTask);

        ResponseEntity<Task> response = taskController.updateTask(taskId, updatedTask);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Updated Task", response.getBody().getName());

        verify(taskService, times(1)).getTaskById(taskId);
        verify(taskService, times(1)).saveTask(updatedTask);
    }

    @Test
    void testUpdateTask_NotFound() {
        Long taskId = 2L;

        Task updatedTask = new Task();
        updatedTask.setName("Updated Task");

        when(taskService.getTaskById(taskId)).thenReturn(Optional.empty());

        ResponseEntity<Task> response = taskController.updateTask(taskId, updatedTask);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is4xxClientError());
        assertNull(response.getBody());

        verify(taskService, times(1)).getTaskById(taskId);
        verify(taskService, never()).saveTask(any());
    }

    @Test
    void testDeleteTask_Found() {
        Long taskId = 1L;

        Task existingTask = new Task();
        existingTask.setId(taskId);

        when(taskService.getTaskById(taskId)).thenReturn(Optional.of(existingTask));
        doNothing().when(taskService).deleteTask(taskId);

        ResponseEntity<Void> response = taskController.deleteTask(taskId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is2xxSuccessful());

        verify(taskService, times(1)).getTaskById(taskId);
        verify(taskService, times(1)).deleteTask(taskId);
    }

    @Test
    void testDeleteTask_NotFound() {
        Long taskId = 2L;

        when(taskService.getTaskById(taskId)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = taskController.deleteTask(taskId);

        assertNotNull(response);
        assertTrue(response.getStatusCode().is4xxClientError());

        verify(taskService, times(1)).getTaskById(taskId);
        verify(taskService, never()).deleteTask(any());
    }
}
