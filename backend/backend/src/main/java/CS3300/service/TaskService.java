package CS3300.service;

import CS3300.repository.TaskRepository;
import CS3300.schema.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByOwnerId(String ownerId) {
        return taskRepository.findByOwnerId(ownerId);
    }

    public List<Task> getTasksByClassId(Long classId) {
        return taskRepository.findByClassId(classId);
    }

    public Task saveTask(Task taskEntity) {
        return taskRepository.save(taskEntity);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}