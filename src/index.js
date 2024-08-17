require('dotenv').config()

const express = require("express");
const cors = require('cors');
// const routes = require("./routes/api/v1/index");
// const connectDB = require("./db/mongodb");
// const googleProvider = require("./utils/PassportProvider");

// const connectMySQLDB = require("./db/mysql");
// const cookieParser = require('cookie-parser');
// const passport = require("passport");
// const connectChat = require("./utils/socketIO");
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');


const app = express();
// const swaggerDocument = YAML.load('./src/api.yaml');


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// app.use(cookieParser())
app.use(cors({
    origin: 'https://2pm-frontend.vercel.app',
    credentials: true,  
    optionsSuccessStatus: 200
}));

app.use(express.json());
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// connectDB();
// googleProvider();
// connectChat();

// connectMySQLDB();

//localhost:8000/api/v1
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// app.use("/api/v1", routes);
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

//localhost:8000
app.listen(8000, () => {
    console.log("Server started at port 8000.");
})