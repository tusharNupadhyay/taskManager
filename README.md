The project follows a modular full-stack structure with separate backend and frontend directories for scalability and maintainability.

For simplicity, access tokens are used with extended expiry. In a production system, refresh tokens and token rotation would be implemented for enhanced security.


### Postman Collection

1. Import the Postman collection:
   postman/taskmanager-postman-collection.json

2. Import the environment:
   postman/taskmanager-environment.json

3. Set environment variable:
   server = http://localhost:8000/api/v1

4. Run APIs in this order:
   - Register
   - Login
   - Create Task
   - Get Tasks
   - Update Task
   - Delete Task