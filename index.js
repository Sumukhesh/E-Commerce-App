const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

//importing middlewares
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//importing routes 
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");


//database connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Database Connected !!");
});

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);

const port = process.env.PORT || 8000;

//server running
app.listen(port, () => {
    console.log(`Server is Running at ${port} ...`);
}) 