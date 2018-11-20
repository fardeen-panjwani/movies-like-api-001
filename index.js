const express = require('express');
const app = express();

const userRoute = require('./app/routes/user/user.route');

const PORT = process.env.PORT || 8080;

app.use('/user', userRoute);

app.use(express.static('public'));

app.listen(PORT, (req, res) => {
	console.log('listening on port: ' + PORT);
});
