// const express = require('express'); 
// const {connectToDB} = require('./config/db');
// const noteRouter = require('./routes/note.routes');
// const userRouter = require('./routes/user.routes');
// const cors = require('cors');
// require('dotenv').config();

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// // Swagger definition
// const swaggerDefinition = {
//     openapi: "3.0.0",
//     info: {
//       title: "Express API for Notes and Users",
//       version: "1.0.0",
//       description:
//         "This is a REST API application made with Express. It manages users and notes for a custom application.",
//       license: {
//         name: "Licensed Under MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "API Support",
//         email: "support@example.com",
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:8000",
//         description: "Development server",
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT"
//         }
//       }
//     }
//   };

// // Swagger options
// const options = {
//     swaggerDefinition,
//     apis: ["./routes/*.js"], // Path to the routes for API definitions
//   };
  
// const swaggerSpec = swaggerJSDoc(options);
  
// const app = express();

// // Swagger route
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// //middleware to pass the request body
// app.use(express.json());

//  //to pass the form data from the frontend to the backend server 
// app.use(express.urlencoded({ extended: false }));




// // app.use(cors(
// //   {
// //     origin: 'https://notes-taking-app-front-end.vercel.app',
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE']
// //   }
// // ));   //to allow cross origin requests from the frontend to the backend server
// //  because the frontend and backend are running on different ports so we need to allow the cross origin requests 
// //  from the frontend to the backend server so that the frontend can communicate with the backend server 





// // const whitelist = [process.env.FRONTEND_URL, process.env.DEPLOYED_FE_URL];

// // const corsOptions = (req, callback) => {
// //   if (whitelist.indexOf(req.header("Origin")) !== -1) {
// //     callback(null, {
// //       origin: req.header("Origin"), //// Automatically reflects the request's origin if in the whitelist
// //       credentials: true,
// //       methods: "GET,HEAD,PATCH,POST,PUT,DELETE",
// //       allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// //     }); // reflect (enable) the requested origin in the CORS response
// //   } else {
// //     callback(null, {origin: false}); // Deny CORS if not in whitelist
// //   }
// // };
// // app.use(cors(corsOptions));

// // app.use(cors({
// //   origin: "*",
// //   credentials: true
// // }));


// // app.use(cors())

// app.use('/notes', noteRouter);
// app.use('/users', userRouter);

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, async() => {
//     try {
//         await connectToDB();
//         console.log(`Server is running on port http://localhost:${PORT}`);
//     } catch (error) {   
//         console.log('Error:', error);
//     }
    
// });


// const express = require("express");
// const { connectToDB } = require("./config/db");
// const noteRouter = require("./routes/note.routes");
// const userRouter = require("./routes/user.routes");
// const cors = require("cors");
// require("dotenv").config();

// const swaggerJSDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// // Swagger definition
// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "Express API for Notes and Users",
//     version: "1.0.0",
//     description:
//       "This is a REST API application made with Express. It manages users and notes for a custom application.",
//     license: {
//       name: "Licensed Under MIT",
//       url: "https://spdx.org/licenses/MIT.html",
//     },
//     contact: {
//       name: "API Support",
//       email: "support@example.com",
//     },
//   },
//   servers: [
//     {
//       url: "https://notestakingappbackend-wx6m.onrender.com", // ✅ Updated to production URL
//       description: "Production server",
//     },
//     {
//       url: "http://localhost:8000",
//       description: "Development server",
//     },
//   ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: "http",
//         scheme: "bearer",
//         bearerFormat: "JWT",
//       },
//     },
//   },
// };

// // Swagger options
// const options = {
//   swaggerDefinition,
//   apis: ["./routes/*.js"], // Path to the routes for API definitions
// };

// const swaggerSpec = swaggerJSDoc(options);

// const app = express();

// // ✅ Apply CORS before any routes
// const allowedOrigins = [
//   "http://localhost:5173", 
//   "https://notes-taking-app-front-end.vercel.app"
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: "GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE",
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// };

// app.use(cors(corsOptions)); 
// app.options("*", cors(corsOptions)); // ✅ Enable preflight requests globally

// // ✅ Manually Handle CORS Headers for Preflight Requests
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
//   res.header("Access-Control-Allow-Credentials", "true");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
//   next();
// });

// // ✅ Swagger route
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // ✅ Middleware for parsing request body
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // ✅ Routes
// app.use("/notes", noteRouter);
// app.use("/users", userRouter);

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, async () => {
//   try {
//     await connectToDB();
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// });


const express = require("express");
const { connectToDB } = require("./config/db");
const noteRouter = require("./routes/note.routes");
const userRouter = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-taking-app-front-end.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// ✅ Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight requests globally

// ✅ Manually Handle CORS for Preflight Requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,PATCH,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ✅ Middleware for Parsing Request Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Swagger Definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Notes and Users",
    version: "1.0.0",
    description: "This is a REST API application made with Express. It manages users and notes.",
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
    { url: "https://notestakingappbackend-wx6m.onrender.com", description: "Production server" },
    { url: "http://localhost:8000", description: "Development server" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};

// ✅ Swagger Setup
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to routes
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/notes", noteRouter);
app.use("/users", userRouter);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
  }
});
