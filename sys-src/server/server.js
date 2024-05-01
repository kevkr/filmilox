const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Controller = require('./controller/Controller');
require('dotenv').config();

const app = express();

// Configure Server
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public')); //Serves resources from public folder

// Set up mongoose
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(
        process.env.MONGODB_CONNECTION_STRING,
        {
            useNewUrlParser: true,
        },
        (err) => {
            if (err) throw err;
            console.log('Database Connected');
        }
    );
}

app.use('/user', require('./routes/userRouter'));
app.use('/user', require('./routes/userProfileRouter'));
app.use('/film', require('./routes/reviewRouter'));
app.use('/admin', require('./routes/movieRouter'));
app.use('/search', require('./routes/searchRouter'));
app.use('/votes', require('./routes/voteRouter'));

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}

// Making sure that admin Account exist
Controller.initScripts()
    .then(() => {
        console.log('Init scripts executed');
    })
    .catch((e) => console.error(e));

module.exports = app;