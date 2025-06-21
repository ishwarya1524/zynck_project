### WaterTable

WaterTable is a dynamic fullstack application that is build on the MERN stack that allows users to customize, create , edit and manage flexible data tables with ease. This application supports 10+ different datatypes to work with. This application also supports full control over structure and content

## Features

```
User authentication with JWT
Create Tables with dynamic columns (text,dropdown,checkbox,etc.,)
Add,edit,delete rows
add, delete columns
Able to edit already saved Tables
Save tables to MongoDb
Secure APIs with token-based authorization
Wonderful UI with Tailwindcss
```

## Different Datatypes to work with

-> Text
-> Number
-> Email
-> Boolean
-> Date
-> Telephone
-> Dropdown
-> Radio
-> Password
-> Time
-> Color

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
| ------ | --------------- | ----------------------- |
| POST   | `/register`     | Register a new user     |
| POST   | `/login`        | Login and get JWT token |
| GET    | `/tables`       | Get all user tables     |
| GET    | `/table/:id`    | Get table by ID         |
| POST   | `/table/create` | Create a new table      |
| PUT    | `/table/:id`    | Update a table          |
| DELETE | `/table/:id`    | Delete a table          |
