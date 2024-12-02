package CS3300.controller;

import CS3300.schema.Class;
import CS3300.service.ClassService;
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

class ClassControllerTest {

    @Mock
    private ClassService classService;

    @InjectMocks
    private ClassController classController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllClasses() {
        List<Class> classes = Arrays.asList(new Class(), new Class());
        when(classService.getAllClasses()).thenReturn(classes);

        List<Class> result = classController.getAllClasses();

        assertEquals(2, result.size());
        verify(classService, times(1)).getAllClasses();
    }

    @Test
    void testGetClassesByOwner() {
        String userId = "123";
        List<Class> classes = Arrays.asList(new Class(), new Class());
        when(classService.getClassesByOwnerId(userId)).thenReturn(classes);

        List<Class> result = classController.getClassesByOwner(userId);

        assertEquals(2, result.size());
        verify(classService, times(1)).getClassesByOwnerId(userId);
    }

    @Test
    void testCreateClass() {
        String userId = "123";
        Class classEntity = new Class();
        classEntity.setOwnerId(userId);

        when(classService.saveClass(any(Class.class))).thenReturn(classEntity);

        Class result = classController.createClass(classEntity, userId);

        assertEquals(userId, result.getOwnerId());
        verify(classService, times(1)).saveClass(classEntity);
    }

    @Test
    void testGetClassById_Found() {
        Long id = 1L;
        Class classEntity = new Class();
        when(classService.getClassById(id)).thenReturn(Optional.of(classEntity));

        ResponseEntity<Class> response = classController.getClassById(id);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(classEntity, response.getBody());
        verify(classService, times(1)).getClassById(id);
    }

    @Test
    void testGetClassById_NotFound() {
        Long id = 1L;
        when(classService.getClassById(id)).thenReturn(Optional.empty());

        ResponseEntity<Class> response = classController.getClassById(id);

        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(classService, times(1)).getClassById(id);
    }

    @Test
    void testUpdateClass_Found() {
        Long id = 1L;
        Class existingClass = new Class();
        Class updatedClass = new Class();
        updatedClass.setId(id);

        when(classService.getClassById(id)).thenReturn(Optional.of(existingClass));
        when(classService.saveClass(any(Class.class))).thenReturn(updatedClass);

        ResponseEntity<Class> response = classController.updateClass(id, updatedClass);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(updatedClass, response.getBody());
        verify(classService, times(1)).getClassById(id);
        verify(classService, times(1)).saveClass(updatedClass);
    }

    @Test
    void testUpdateClass_NotFound() {
        Long id = 1L;
        Class updatedClass = new Class();
        when(classService.getClassById(id)).thenReturn(Optional.empty());

        ResponseEntity<Class> response = classController.updateClass(id, updatedClass);

        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(classService, times(1)).getClassById(id);
        verify(classService, times(0)).saveClass(any(Class.class));
    }

    @Test
    void testDeleteClass_Found() {
        Long id = 1L;
        when(classService.getClassById(id)).thenReturn(Optional.of(new Class()));

        ResponseEntity<Void> response = classController.deleteClass(id);

        assertEquals(204, response.getStatusCodeValue());
        verify(classService, times(1)).getClassById(id);
        verify(classService, times(1)).deleteClass(id);
    }

    @Test
    void testDeleteClass_NotFound() {
        Long id = 1L;
        when(classService.getClassById(id)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = classController.deleteClass(id);

        assertEquals(404, response.getStatusCodeValue());
        verify(classService, times(1)).getClassById(id);
        verify(classService, times(0)).deleteClass(id);
    }
}
