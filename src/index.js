// require('dotenv').config()

// const express = require("express");
// const cors = require('cors');
// const routes = require("./routes/api/v1/index");
// const connectDB = require("./db/mongodb");
// const googleProvider = require("./utils/PassportProvider");

// // const connectMySQLDB = require("./db/mysql");
// const cookieParser = require('cookie-parser');
// const passport = require("passport");
// const connectChat = require("./utils/socketIO");
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const path = require('path');
// const fs = require('fs');
// const app = express();

// app.get('/api.yaml', (req, res) => {
//     const filePath = path.join(__dirname, '../public/api.yaml');
//     if (fs.existsSync(filePath)) {
//         res.sendFile(filePath);
//     } else {
//         res.status(404).send('File not found');
//     }
// });

// // const swaggerDocumentPath = path.join(__dirname, '../public/api.yaml');
// // const swaggerDocument = YAML.load(swaggerDocumentPath);


// // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// // app.use(cors({
// //     origin: 'https://2pm-frontend.vercel.app',
// //     credentials: true,  
// //     optionsSuccessStatus: 200
// // })); 

// app.use(cors({
//     origin: 'https://2pm-frontend.vercel.app',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     optionsSuccessStatus: 200
// }));

// app.use(express.json());
// app.use(cookieParser())
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// connectDB();
// googleProvider();
// connectChat();

// // connectMySQLDB();

// //localhost:8000/api/v1
// app.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

// app.use("/api/v1", routes);


// //localhost:8000
// app.listen(8000, () => {
//     console.log("Server started at port 8000.");
// })

require('dotenv').config()

const express = require("express");
const cors = require('cors');
const routes = require("./routes/api/v1/index");
const connectDB = require("./db/mongodb");
const googleProvider = require("./utils/PassportProvider");
const cookieParser = require('cookie-parser');
const passport = require("passport");
// const connectChat = require("./utils/socketIO"); //vercel not supported
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require("path");


const app = express();

googleProvider();

const _dirname = path.resolve();

const __swaggerDistPath = path.join(_dirname, 'node_modules', 'swagger-ui-dist'); //install swagger-ui-dist

const swaggerDocument = YAML.load(path.resolve('./public', 'api.yaml'));
  

app.use(
  '/api/docs',
  express.static(__swaggerDistPath, { index: false }), // Serve Swagger UI assets
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: '/public/api.yaml' // Path to your YAML file
    }
  })
);

connectDB();
 

app.use(cors({
    origin: 'https://2pm-frontend.vercel.app',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser())
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// connectChat(); //not support by vercel


//localhost:8000/api/v1
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use("/api/v1", routes);


//localhost:8000
app.listen(8000, () => {
    console.log("Server started at port 8000.");
})

//cors error solved by put googleProvider(); befors cors() apply