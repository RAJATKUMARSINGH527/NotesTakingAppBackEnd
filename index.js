const express = require('express'); 
const {connectToDB} = require('./config/db');
const noteRouter = require('./routes/note.routes');
const userRouter = require('./routes/user.routes');
const cors = require('cors');
require('dotenv').config();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

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
      url: "https://notestakingappbackend-8t72.onrender.com", // ✅ Updated to production URL
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




// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from Origin: ${req.headers.origin}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5174", // Local development
      "https://notes-taking-app-front-end.vercel.app", // Production frontend
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable if you use cookies or auth tokens
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());

 //to pass the form data from the frontend to the backend server 
app.use(express.urlencoded({ extended: false }));


// app.use(cors())

// Routes
app.use('/notes', noteRouter);
app.use('/users', userRouter);



// Test endpoint to verify server is alive
app.get('/test', (req, res) => {
  res.json({ message: 'Server is alive' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error:", error);
  }
});