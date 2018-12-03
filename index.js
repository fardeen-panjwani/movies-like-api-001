const express = require('express');
const app = express();
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const PORT = process.env.PORT || 8080;

require('dotenv').config();

const userRoute = require('./app/routes/user/user.route');

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', '*');
	res.append('Access-Control-Allow-Methods', '*');
	res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	res.append('Access-Control-Allow-Credentials', true);
	next();
});

app.use(morgan("combined"))
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://${process.env.MON_ATL_USER}:${process.env.MON_ATL_PWD}@movies-like-0jptf.mongodb.net/test?retryWrites=true`);

app.use('/user', userRoute);

app.use(express.static('public'));

app.listen(PORT, (req, res) => {
	console.log('listening on port: ' + PORT);
});
