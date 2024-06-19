const loadEnv = require("./env");
const env = loadEnv();
const express = require("express");
const app = express();
const cors = require("cors");
const { createNewLogFile } = require("./logging");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { RESPONSES } = require("./app/common");
const { CustomError } = require("./app/utils/customErrorHandler");
// enable cors
app.use(cors({ allow: "*" }));


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dnax7xgqr',
    api_key: '854191491972377',
    api_secret: '9wHCXu1wssjU5798Mq5WuwpHZHU'
});

// connect to db
mongoose
    .connect(env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connnected to database successfully");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(express.json());

// routes
// app.get('/', (req, res) => res.send("hello"))

app.use("/api/v3/category", require('./app/routes/category.route.js'))
app.use("/api/v3/article", require('./app/routes/article.route.js'));
app.use('/api/v3/media', require('./app/routes/media.route.js'))

// app.use("*", (req, res, next) => {
//     const err = new CustomError(
//         `cannot find ${req.originalUrl} on the server`,
//         404,
//     );
//     next(err);
// });

// //error handler middleware
// app.use((error, req, res, next) => {
//     error.statusCode = error.statusCode || RESPONSES.SERVER_ERROR;
//     error.status = error.status || "error";
//     console.log(error)
//     return res
//         .status(error.statusCode)
//         .json({ status: error.statusCode, message: error.message });
// });
// logging using morgan
createNewLogFile(app, morgan);

app.listen(env.SERVER_PORT, () =>
    console.log(`server running on port ${env.SERVER_PORT}`),
);