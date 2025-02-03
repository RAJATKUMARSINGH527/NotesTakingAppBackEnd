const express = require('express'); 
const {connectToDB} = require('./config/db');
const noteRouter = require('./routes/note.routes');
const userRouter = require('./routes/user.routes');
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Express API for Notes and Users",
      version: "1.0.0",
      description:
        "This is a REST API application made with Express. It manages users and notes for a custom application.",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  };

// Swagger options
const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // Path to the routes for API definitions
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  
  const app = express();
  
  // Swagger route
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  


//middleware to pass the request body
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
));   //to allow cross origin requests from the frontend to the backend server
//  because the frontend and backend are running on different ports so we need to allow the cross origin requests 
//  from the frontend to the backend server so that the frontend can communicate with the backend server 

app.use('/notes', noteRouter);
app.use('/users', userRouter);



app.listen(8000, async() => {
    try {
        await connectToDB();
        console.log('Server is running on port http://localhost:8000');
    } catch (error) {   
        console.log('Error:', error);
    }
    
});