require('dotenv').config()

const express = require("express");
const routes = require("./routes/api/v1/index");
const connectDB = require("./db/mongodb");
const cors = require('cors');
const connectMySQLDB = require("./db/mysql");
const cookieParser = require('cookie-parser');
const googleProvider = require("./utils/PassportProvider");
const passport = require("passport");
const connectChat = require("./utils/socketIO");

const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

connectDB();
googleProvider();
connectChat();

// connectMySQLDB();

//localhost:8000/api/v1
app.use("/api/v1", routes);

//localhost:8000
app.listen(8000, () => {
    console.log("Server started at port 8000.");
})