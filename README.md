# react_project
A React project with Nodejs &amp; mongoDB

## Introduction
This is a full-stack application developed using React, Node.js,RESTful API and MongoDB, with separate deployments for the front-end and back-end.

## Tech Stack
- **Front-end**: React, JavaScript, React-Bootstrap
- **Back-end**: Node.js,RESTful API, MongoDB

## Features
- 
- User registration and login
- Data display and management using CRUD (Create, Read, Update, Delete) operations
- Responsive design

## Front-end Structure

The front-end of the application is built using React.js and is structured to facilitate seamless navigation between different pages using `react-router-dom`. The main components of the application include:

### Front-end Key Components
1. **AppMain**
   - Responsible for displaying and querying data.
   - Allows users to delete data items.
   - Serves as the primary interface for data management.

2. **EditPage**
   - Used for creating and modifying data items.
   - Provides forms for user input to add or edit information.

3. **LoginRegister**
   - Handles user authentication.
   - Allows users to log in and register new accounts.

### Project Structure
```plaintext
fortress_client/
├── build/
├── node_modules/
├── public/
└── src/
    ├── static/
    ├── AddressSearch.js
    ├── AppMain.js
    ├── AppMain.css
    ├── Datalist.js
    ├── EditPage.js
    ├── LoginRegister.js
    ├── LoginRegister.css  
    ├── main.js
    ├── NavigationBars.js
    ├── index.js
    ├── index.css
    └── ...


## Back-end Structure

The back-end is built using Express.js and provides a RESTful API for data management. The MongoDB connection and data handling logic are located in `fetch_fortressData.js`. Below is an overview of the key components and their functionalities:

### Key Features
- **Authentication**: Users can log in with a username and password. The server validates credentials and issues a JWT token for authorized access.
- **Registration**: New users can register, and their passwords are securely hashed before being stored in the database.
- **CRUD Operations**: The API supports Create, Read, Update, and Delete operations for various data types (e.g., Products, Shops, Q&A) using the following endpoints:
  - **Create**: `POST /create` - Adds new data items.
  - **Read**: `GET /read` - Retrieves data items based on specified criteria.
  - **Update**: `PUT /update` - Modifies existing data items.
  - **Delete**: `DELETE /delete` - Removes data items.

### Project Structure
```plaintext
fortress_server/
├── fetch_fortressData.js  # Contains MongoDB connection and data handling logic
├── main.js                 # Main server file for Express.js
└── node_modules/

### MongoDB Connection and Data Handling
- The MongoDB connection and the schema definitions are handled in `fetch_fortressData.js`. 
- The application connects to a local MongoDB database using the following connection string:
  ```javascript
  await mongoose.connect('mongodb://localhost:27017/fortress');

### How to Run the Project
To run the project locally, follow these steps:

#### Front-end
1. Navigate to the `fortress_client` directory:
   ```bash
   cd fortress_client
2. Install the necessary dependencies:
  npm install
3. Start the development server:
  npm start
4. Open your browser and visit http://localhost:3000 to view the application.

#### back-end
1. Navigate to the `fortress_client` directory:
   ```bash
   cd fortress_server
2. Install the necessary dependencies:
  npm install
3. Start the development server:
  node main.js
4. The server will be running at http://localhost:8081.

## Database Setup

This project uses a local MongoDB database to store and manage data. Follow the steps below to set up and populate your MongoDB database.

### Prerequisites
- Ensure you have [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.
- Make sure MongoDB is running. You can start it using the following command:
  ```bash
  mongod


## Introduction
If you have any questions, suggestions, or feedback, feel free to reach out:

Email: manloktse@gmail.com
