package CS3300.service;

import CS3300.repository.ClassRepository;
import CS3300.schema.Class;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClassServiceTest {

    private ClassRepository classRepository;
    private ClassService classService;

    @BeforeEach
    void setUp() {
        classRepository = Mockito.mock(ClassRepository.class);
        classService = new ClassService();
        classService.classRepository = classRepository; // Inject the mock repository
    }

    @Test
    void testGetAllClasses() {
        List<Class> mockClasses = new ArrayList<>();
        mockClasses.add(new Class("Math"));
        mockClasses.add(new Class("Science"));

        when(classRepository.findAll()).thenReturn(mockClasses);

        List<Class> result = classService.getAllClasses();

        assertEquals(2, result.size(), "The service should return all classes");
        assertEquals("Math", result.get(0).getName(), "The first class name should match");
        assertEquals("Science", result.get(1).getName(), "The second class name should match");

        verify(classRepository, times(1)).findAll();
    }

    @Test
    void testGetClassById_Found() {
        Long classId = 1L;
        Class mockClass = new Class("English");
        mockClass.setId(classId);

        when(classRepository.findById(classId)).thenReturn(Optional.of(mockClass));

        Optional<Class> result = classService.getClassById(classId);

        assertTrue(result.isPresent(), "The service should find the class by ID");
        assertEquals("English", result.get().getName(), "The class name should match the mock data");
        verify(classRepository, times(1)).findById(classId);
    }

    @Test
    void testGetClassById_NotFound() {
        Long classId = 1L;

        when(classRepository.findById(classId)).thenReturn(Optional.empty());

        Optional<Class> result = classService.getClassById(classId);

        assertFalse(result.isPresent(), "The service should return an empty Optional if the class is not found");
        verify(classRepository, times(1)).findById(classId);
    }

    @Test
    void testGetClassesByOwnerId() {
        String ownerId = "owner123";
        List<Class> mockClasses = new ArrayList<>();
        mockClasses.add(new Class("History"));
        mockClasses.add(new Class("Geography"));

        when(classRepository.findByOwnerId(ownerId)).thenReturn(mockClasses);

        List<Class> result = classService.getClassesByOwnerId(ownerId);

        assertEquals(2, result.size(), "The service should return all classes for the owner");
        assertEquals("History", result.get(0).getName(), "The first class name should match");
        assertEquals("Geography", result.get(1).getName(), "The second class name should match");
        verify(classRepository, times(1)).findByOwnerId(ownerId);
    }

    @Test
    void testSaveClass() {
        Class classEntity = new Class("Physics");
        when(classRepository.save(classEntity)).thenReturn(classEntity);

        Class result = classService.saveClass(classEntity);

        assertNotNull(result, "The saved class should not be null");
        assertEquals("Physics", result.getName(), "The saved class name should match");
        verify(classRepository, times(1)).save(classEntity);
    }

    @Test
    void testDeleteClass() {
        Long classId = 1L;

        doNothing().when(classRepository).deleteById(classId);

        classService.deleteClass(classId);

        verify(classRepository, times(1)).deleteById(classId);
    }
}
