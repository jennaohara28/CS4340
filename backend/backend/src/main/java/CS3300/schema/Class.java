package CS3300.schema;

import java.util.ArrayList;

public class Class {

    private String name;
    private ArrayList<Task> tasks;
    private String color;

    public Class(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }

    public void displayTasks() {
        for (Task task : tasks) {
            System.out.println(task.name);
        }
    }

    public void addTask(Task toAdd){
        tasks.add(toAdd);
    }
    public void removeTask(Task toRemove){
        tasks.remove(toRemove);
    }

}
