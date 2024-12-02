# CS3300 Student Planner Application

## About

Welcome to our project! This application is designed to help students track their assignments across classes, making it easier to stay organized and on top of deadlines. With features that allow students to set due dates, assign complexity levels, and prioritize tasks, the app ensures that nothing falls through the cracks. It organizes assignments by class and displays them visually with helpful charts, giving students a clear overview of their workload. 

Our team of passionate developers created this app with the goal of helping students break free from procrastination and take control of their academic responsibilities. Whether you're juggling multiple deadlines or trying to improve your study habits, this app offers an easy-to-use solution to stay on track and be productive.

To get started with using the application, please follow the installation instructions below.


## Installation Instructions

### Prerequisites
- **Java Development Kit (JDK)** (Java 11 or newer)
- **IDE** of your choice (e.g., IntelliJ IDEA, Eclipse)

---

## Backend

### Install Maven
 Maven allows you to manage dependencies, build projects, and run Maven goals directly from your IDE, streamlining your development process.

1. **Download Maven:**
   - Visit the [Maven download page](https://maven.apache.org/download.cgi) and download the latest binary zip archive.

2. **Extract the Archive:**
   - Extract the downloaded zip file to a preferred location on your system.

3. **Configure Environment Variables:**
   - Add the `apache-maven-x.x.x-bin/bin/` directory to your system `PATH` environment variable.

4. **Verify Installation:**
   - Open a new terminal and run:
     ```bash
     mvn -v
     ```
   - Ensure Maven is installed correctly. For more details, see the [Maven installation guide](https://maven.apache.org/install.html).

### Run the Spring Boot Project

1. **Navigate to Project Directory:**
   - Change to the directory of your project:
     ```bash
     cd /path/to/your/project
     ```

2. **Run the Application:**
   - Execute the following command to start the Spring Boot application:
     ```bash
     mvn spring-boot:run
     ```

3. **Access the Application:**
   - Your application should now be running. You can access it at the configured endpoint.

---

## Frontend

To develop Angular applications, you need to install Node.js and npm (Node Package Manager). Follow these steps to install Node.js, npm, and Angular CLI.

### 1. Install Node.js and npm

#### On Windows

1. **Download Node.js:**
   - Go to the [Node.js download page](https://nodejs.org/) and download the Windows Installer (`.msi`) for the LTS (Long Term Support) version.

2. **Run the Installer:**
   - Double-click the downloaded `.msi` file and follow the prompts. Ensure that the option to install `npm` is selected.

3. **Verify Installation:**
   - Open Command Prompt and run:
     ```bash
     node -v
     npm -v
     ```
   - Confirm that Node.js and npm are installed correctly by seeing a version upon running those commands.

### 2. Install Angular CLI

With Node.js and npm installed, you can now install Angular CLI.

1. **Install Angular CLI:**
   - Open a terminal or Command Prompt and run:
     ```bash
     npm install -g @angular/cli
     ```

2. **Verify Angular CLI Installation:**
   - Check the version of Angular CLI:
     ```bash
     ng version
     ```

### 3. Run the Angular Application

1. **Navigate to Project Directory:**
   - Change to the directory of your Angular project:
     ```bash
     cd frontend
     ```

2. **Start the Development Server:**
   - Run the following command to start the Angular development server:
     ```bash
     ng serve
     ```

3. **Access the Application:**
   - Open your browser and navigate to `http://localhost:4200` to view your Angular application.

test
