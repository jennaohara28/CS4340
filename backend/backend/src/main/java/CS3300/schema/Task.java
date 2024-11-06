package CS3300.schema;

public class Task {

    public String name;           //public for Class use
    private String type;
    private int timeAll;
    private String status;
    private int dueDate;
    private int priority;
    private Long id;
    private Long ownerId; // Add this field

    public Task(String name, String type, int dueDate) {       //<- required parameters when creating assignments
        this.name = name;                                             //can use setters as needed for rest of parameters
        this.type = type;
        this.dueDate = dueDate;
    }

    // Getters and setters for ownerId
    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    // Other getters and setters
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public int getTimeAll() {
        return timeAll;
    }
    public void setTimeAll(int timeAll) {
        this.timeAll = timeAll;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public int getDueDate() {
        return dueDate;
    }
    public void setDueDate(int dueDate) {
        this.dueDate = dueDate;
    }

    public int getPriority() {
        return priority;
    }
    public void setPriority(int priority) {
        this.priority = priority;
    }

    public void displayTask(){
        System.out.println("Name: " + name);
        System.out.println("Type: " + type);
        System.out.println("Time: " + timeAll);
        System.out.println("Status: " + status);
        System.out.println("Due Date: " + dueDate);
    }

    public void setId(Long id) {
        this.id = id;
    }
}