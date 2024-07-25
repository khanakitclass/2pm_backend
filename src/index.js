const express = require("express");
const routes = require("./routes/api/v1/index");
const connectDB = require("./db/mongodb");
const cors = require('cors');
const connectMySQLDB = require("./db/mysql");
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
app.use(cors());
app.use(express.json());

connectDB();

// connectMySQLDB();

//localhost:8000/api/v1
app.use("/api/v1", routes);

//localhost:8000
app.listen(8000, () => {
    console.log("Server started at port 8000.");
})