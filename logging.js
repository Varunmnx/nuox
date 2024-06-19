const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}
const createNewLogFile = (app, morgan) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const logFileName = `access-${timestamp}.log`;

    const accessLogStream = fs.createWriteStream(
        path.join(logsDirectory, logFileName),
        { flags: "a" },
    );
    app.use(morgan("combined", { stream: accessLogStream }));
};

module.exports = { createNewLogFile };