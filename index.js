const express = require('express');
const mongoose = require('mongoose');

// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const cors = require('cors');
require('dotenv').config();
const userModel = require('./models/user.model');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL)
    .then(() => {
        console.log('database connected successfully');
    })
    .catch((err) => {
        console.log(err);
    })

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/views/index.html');

})

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // password: md5(password),

        // hashing password with bcrypt
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            const newUser = new userModel({
                email: email,
                password: hash,

            })
            const userSaved = await newUser.save();
            res.status(201).json({
                message: 'user created successfully',
                userSaved
            })
        })
    }
    catch (error) {
        res.status(500).json(
            error.message
        )
    }
})

app.post('/login', async (req, res) => {
    // const email = req.body.email;
    // const password = md5(req.body.password);
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({
            email,
        });
        if (user) {
            // check hashing password with bcrypt
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    res.status(200).json({
                        message: 'login successful',
                    })
                }
                else {
                    res.status(401).json({
                        message: 'login failed'
                    })
                }
            })
        }
        else {
            res.status(401).json({
                message: 'User Not Found'
            })
        }
    }
    catch (error) {
        res.status(500).json(
            error.message
        )
    }
})

//handling route not found

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not Found'
    })
})

//handling server error
app.use((err, req, res, next) => {
    res.status(505).json({
        message: 'something broke'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



