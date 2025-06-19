### WaterTable

This is a fullstack project depends on MERN stack that allows users to create, edit and manage dynamic tables

```
## Features

User authentication with JWT
Create Tables with dynamic columns (text,dropdown,checkbox,etc.,)
Add,edit,delete rows
Save tables to MongoDb
Secure APIs with token-based authorization
Wonderful UI with Tailwindcss
```
## Tech Stack

### Frontend:

- React.js
- Tailwind CSS
- Axios
- React Router

### Backend:
- Node.js
- Express.js
- MongoDb with Mongoose
- Json Web Token
- bcryptjs
- cors

### API Endpoints

| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| POST   | `/register`     | Register a new user     |
| POST   | `/login`        | Login and get JWT token |
| GET    | `/tables`       | Get all user tables     |
| GET    | `/table/:id`    | Get table by ID         |
| POST   | `/table/create` | Create a new table      |
| PUT    | `/table/:id`    | Update a table          |
| DELETE | `/table/:id`    | Delete a table          |

  
