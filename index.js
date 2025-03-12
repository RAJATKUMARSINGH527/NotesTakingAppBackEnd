const express = require('express'); 
const {connectToDB} = require('./config/db');
const noteRouter = require('./routes/note.routes');
const userRouter = require('./routes/user.routes');
const cors = require('cors');
require('dotenv').config();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

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
      url: "https://notestakingappbackend-wx6m.onrender.com", // ✅ Updated to production URL
      description: "Production server",
    },
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
        bearerFormat: "JWT",
      },
    },
  },
};
// Swagger options
const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // Path to the routes for API definitions
  };
  
const swaggerSpec = swaggerJSDoc(options);

// Swagger route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



//middleware to pass the request body
app.use(express.json());

 //to pass the form data from the frontend to the backend server 
app.use(express.urlencoded({ extended: false }));




// app.use(cors(
//   {
//     origin: 'https://notes-taking-app-front-end.vercel.app',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
//   }
// ));   //to allow cross origin requests from the frontend to the backend server
//  because the frontend and backend are running on different ports so we need to allow the cross origin requests 
//  from the frontend to the backend server so that the frontend can communicate with the backend server 





// const whitelist = [process.env.FRONTEND_URL, process.env.DEPLOYED_FE_URL];

// const corsOptions = (req, callback) => {
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     callback(null, {
//       origin: req.header("Origin"), //// Automatically reflects the request's origin if in the whitelist
//       credentials: true,
//       methods: "GET,HEAD,PATCH,POST,PUT,DELETE",
//       allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     }); // reflect (enable) the requested origin in the CORS response
//   } else {
//     callback(null, {origin: false}); // Deny CORS if not in whitelist
//   }
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // ✅ Enable preflight requests globally



// app.use(cors({
//   origin: "*",
//   credentials: true
// }));



app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5174",
        "https://notes-taking-app-front-end.vercel.app",
      ];
      // Allow all Netlify preview URLs and local development
      if (
        !origin || // Allow non-browser requests (e.g., Postman)
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // Allow Netlify preview deployments
      ) {
        callback(null, true);
      } else {
        console.log(`CORS rejected origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

// app.use(cors())

app.use('/notes', noteRouter);
app.use('/users', userRouter);

const PORT = process.env.PORT || 8000;


app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error:", error);
  }
});
