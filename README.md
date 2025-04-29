# CS3300 Student Planner Application

## About

Welcome to our project! This application is designed to help students track their assignments across classes, making it easier to stay organized and on top of deadlines. With features that allow students to set due dates, assign complexity levels, and prioritize tasks, the app ensures that nothing falls through the cracks. It organizes assignments by class and displays them visually with helpful charts, giving students a clear overview of their workload. 

Our team of passionate developers created this app with the goal of helping students break free from procrastination and take control of their academic responsibilities. Whether you're juggling multiple deadlines or trying to improve your study habits, this app offers an easy-to-use solution to stay on track and be productive.

To find out more about the application and its features, or begin using it, visit [here](https://jimby3.github.io/CS3300/about).

To get started with self-hosting application, please follow the installation instructions below.

[Go to Installation Instructions](#installation-instructions)

<p align="center">
  <img src="frontend/src/assets/images/logo.png" alt="Project Logo" />
</p>


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

# Mobile Frontend (Expo Go)

### To run the mobile version of the application using Expo Go, follow these steps:

## 1.  Install Prerequisites

Node.js and npm: Install as described in the Angular frontend section above.

Expo CLI:

```bash
 npm install -g expo-cli
 ```


Expo Go App: Install Expo Go on your mobile device from the Google Play Store or Apple App Store.

## 2. Navigate to the Mobile Frontend Directory

```bash
cd mobile-frontend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Expo Development Server

```bash
npx expo start
```

This will open the Expo developer tools in your browser.

## 5. Run on Mobile Device

1. Open the Expo Go app on your phone.

2. Scan the QR code displayed in the terminal or browser.

3. The app will launch on your device.
