# DOC CSO PETFINDER APP (unfinished)

## 1) Presentation:

The **DOC CSO PETFINDER APP** is a comprehensive project consisting of multiple microservices, each operating independently without dependencies on others. The project utilizes RabbitMQ as a message broker, enabling seamless communication between microservices through the `amqp` protocol. Here's an overview of the project's structure:

- **gateway**: The API Gateway serves as the entry point for external clients to interact with various microservices.

- **account-service**: The Account Microservice is responsible for handling all requests related to user management and authentication. It operates with its own database.

- **alert-service**: The Alert Microservice manages requests pertaining to alert management.

- **pet-alert-scrapper**: The Pet Alert Scrapper Microservice is in charge of initiating the scraping process on the PetAlert website and forwarding the gathered data for processing by the **alert-service** project.

- **empty-service**: This project serves as a template for creating new microservices. It contains the minimal set of libraries required to kickstart a microservice development.

- **db-dumps**: This folder acts as a volume mount for our databases, facilitating data storage and retrieval.

## 2) Post Startup Actions:

Before starting the project, ensure that you have configured the necessary environment variables. Each project includes an `env.dist` file for this purpose. To set up the environment, simply remove the `.dist` extension from the file, and you'll be ready to proceed.

Also Make sure you don't have any processes running on the following ports: ***8080, 8081, 8082, 3000, 5342, 5433, 5672 and 15672***.

## 3) Starting the Project:

### a) Local Startup:

To initiate the project in your local development environment, follow these steps:

1. Open a terminal window.

2. Navigate to the project's root folder.

3. Run the following command:

   ```bash
   docker-compose -f docker-compose-dev.yml up --build
<span/>
### b) Production Startup:

To initiate the project in your production environment, follow these steps:

1. Open a terminal window.

2. Navigate to the project's root folder.

3. Run the following command:

   ```bash
   docker-compose up --build
<span/>
This will build and deploy the project in your specified environment, allowing you to utilize its full functionality.

<br/>
## 4) Swagger doc:
Once the project is up and running you can access the different api endpoints using swagger:

```http://localhost:8080/api```

<br/>
Feel free to explore each microservice's documentation and codebase for more details on their specific functionalities and usage. Happy coding!