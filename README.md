# PERN-To-Do-App

## CI/CD Pipeline with Jenkins, SonarQube, and Nexus

Set up a CI/CD pipeline with Jenkins, SonarQube, and Nexus using Docker Compose. It includes steps to configure Postgres, install necessary services, and integrate Jenkins with SonarQube and Nexus.

---

## Prerequisites

- Docker and Docker Compose installed on your system.
- Basic knowledge of CI/CD tools like Jenkins, SonarQube, and Nexus.

---

## Steps to Set Up

### Step 1: Create a Database User and Database

We use **Postgres** as the database for this application. Follow these steps:

1. Open **pgAdmin** from your start menu.

2. Navigate to **Login/Group Roles** under the server.
   - Right-click and select `Create > Login/Group Role`.
   - Provide a name under the **General** tab.
   - Go to the **Definition** tab and set a password.
   - In **Privileges**, enable `Login` and assign `Superuser` privileges.

---

### Step 2: Create a `docker-compose.yml` File

1. Navigate to your project directory and create a folder (optional) named `docker`.
2. Inside the folder, create a file named `docker-compose.yml` with the following content:

   ```yaml
   version: "3"

   services:
     jenkins:
       image: jenkins/jenkins:lts
       container_name: jenkins
       ports:
         - "8082:8082"
         - "50000:50000"
       volumes:
         - jenkins_home:/var/jenkins_home
       environment:
         JENKINS_OPTS: --httpPort=8082

     sonarqube:
       image: sonarqube:latest
       container_name: sonarqube
       ports:
         - "9000:9000"
       environment:
         SONARQUBE_JDBC_URL: jdbc:postgresql://db:5432/perntodo
         SONARQUBE_JDBC_USERNAME: sonar
         SONARQUBE_JDBC_PASSWORD: sonar
       depends_on:
         - db

     db:
       image: postgres:latest
       container_name: postgres
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
         POSTGRES_DB: perntodo

     nexus:
       image: sonatype/nexus3:latest
       container_name: nexus
       ports:
         - "8081:8081"
       volumes:
         - nexus-data:/nexus-data

   volumes:
     jenkins_home:
     nexus-data:
     postgres_data:
   ```

3. Run `docker-compose up -d` to start all services in detached mode.

### Step 3: Configure Jenkins

1. Open Jenkins at http://localhost:8082.
2. Go to Manage Jenkins > Plugins and install the following plugins:

   - NodeJS
   - SonarQube Scanner
   - Nexus Artifact Uploader
   - GitHub

3. Navigate to Manage Jenkins > Tools and configure:
   - NodeJS versions
   - SonarQube versions

### Step 4: Configure SonarQube

1. Open SonarQube at http://localhost:9000.

2. Generate an authentication token:
   - Go to Administration > Security > Users.
   - Click on Update Token, add a name, and generate the token.
   - Save the token securely.

3. Add the token to Jenkins:
   - Navigate to Manage Jenkins > Credentials.
   - Add new credentials with Kind: Secret Text and paste the token.

### Step 5: Configure Nexus

1. Open Nexus at http://localhost:8081.

2. Log in using the default admin credentials found in /nexus-data/admin-password.

3. Configure repositories:
   - Create group, proxy, and hosted repositories.
   - Add proxy and hosted repositories as members of the group.
4. Enable npm support:
   - Go to Security > Realms and activate npm Bearer Token Realm.

### Step 6: Publish Files Using npm

1.  Log in to Nexus via npm:

2.  Open bash and copy code below:

    ```group
    npm login --registry=http://localhost:8081/repository/npm-todo-group/
    ```

3.  Again, run the code below:

    ```repo
    npm login --registry=http://localhost:8081/repository/npm-todo-repo/
    ```

4.  Verify and create .npmrc:

    ```npm
    cat ~/.npmrc
    ```
    
5.  Add publishConfig in package.json:

```json
"publishConfig": {
"registry": "http://localhost:8081/repository/npm-todo-repo/"
}
```

Step 7: Configure Nexus in Jenkins
Add Nexus credentials:
Navigate to Manage Jenkins > Credentials.
Add new credentials of type Secret File.
Configure Nexus repository settings in Manage Jenkins > Configure System.
Step 8: Create a Jenkins Pipeline
In Jenkins, go to Dashboard > New Item and create a pipeline.
Configure the pipeline:
Add a description and the GitHub project URL.
Use Pipeline Script from SCM and specify:
SCM: Git
Repository URL
Script Path
Step 9: Run the Pipeline
Go to the Jenkins dashboard and trigger the build.
Monitor the build process and logs.
URLs for Services
Jenkins: http://localhost:8082
SonarQube: http://localhost:9000
Nexus: http://localhost:8081
