package CS3300.service;

import CS3300.repository.TaskRepository;
import CS3300.schema.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTasks() {
        // Given
        Task task1 = new Task();
        task1.setId(1L);
        task1.setName("Task 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setName("Task 2");

        when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        // When
        List<Task> result = taskService.getAllTasks();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Task::getName).containsExactly("Task 1", "Task 2");
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void testGetTaskById_TaskExists() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setName("Task 1");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        // When
        Optional<Task> result = taskService.getTaskById(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Task 1");
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTaskById_TaskDoesNotExist() {
        // Given
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<Task> result = taskService.getTaskById(1L);

        // Then
        assertThat(result).isNotPresent();
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTasksByOwnerId() {
        // Given
        Task task1 = new Task();
        task1.setId(1L);
        task1.setOwnerId("owner1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setOwnerId("owner1");

        when(taskRepository.findByOwnerId("owner1")).thenReturn(Arrays.asList(task1, task2));

        // When
        List<Task> result = taskService.getTasksByOwnerId("owner1");

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).extracting(Task::getId).containsExactly(1L, 2L);
        verify(taskRepository, times(1)).findByOwnerId("owner1");
    }

    @Test
    void testGetTasksByClassId() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setClassId(100L);

        when(taskRepository.findByClassId(100L)).thenReturn(List.of(task));

        // When
        List<Task> result = taskService.getTasksByClassId(100L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getClassId()).isEqualTo(100L);
        verify(taskRepository, times(1)).findByClassId(100L);
    }

    @Test
    void testSaveTask() {
        // Given
        Task task = new Task();
        task.setName("New Task");

        when(taskRepository.save(task)).thenReturn(task);

        // When
        Task result = taskService.saveTask(task);

        // Then
        assertThat(result.getName()).isEqualTo("New Task");
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void testDeleteTask() {
        // Given
        Long taskId = 1L;

        // When
        taskService.deleteTask(taskId);

        // Then
        verify(taskRepository, times(1)).deleteById(taskId);
    }
}
