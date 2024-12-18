const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mainRouter = require("./routers/indexRouter");
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

const mongoUri = process.env.MONGODB_URI

mongoose.connect(mongoUri).then(() => {
    console.log("connected to MongoDB");
})
    .catch((err) => {
        console.error("failed to connect mongo" + err);
    })


app.use("/", (req, res, next) => {
    console.log(req.method, req.url);
    next();
})


app.use("/", mainRouter);






const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("running on port " + port);
})