const hostname = '0.0.0.0';
const port = 4000;

require('dotenv').config()
const express = require('express');
var fs = require('fs')
const OpenApiValidator = require('express-openapi-validator');
const https=require('http')
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;


const app = express();
const cors = require('cors');
app.use(cors({credentials: true, origin: 'http://localhost:4000'}));

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const mergedController = require("./mergeCenter");

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(mergedController.api_spec));
app.use(
    OpenApiValidator.middleware({
        apiSpec: mergedController.api_spec,
        validateResponses: false, // <-- to validate responses
    }),
);

app.use((err, req, res, next) => {
    // format errors
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});
const httpsOptions = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer( app)
    .listen(port,hostname, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
})
// const http = require('http');
// const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: "GET,PUT,POST,DELETE"
    }
});

io.on('connection', (socket) => {
    mergedController.socket.receiveCryptoData(socket,io)
});
mergedController.app(app,io)
const cryptoHelper=require('./service/crypto/helper')
cryptoHelper(io)
