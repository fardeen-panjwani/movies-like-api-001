/**
 * @author : anonymous
 */

const express = require("express");
const router = new express.Router();
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const checkAuth = require("../../middlewares/checkAuth.middleware");

const User = require("../../models/user/user.model");


router.get('/', checkAuth,  (req, res, next) => {

    User
        .find({})
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length,
                users: docs.map((user) => {
                    return ({
                        _id: user._id, 
                        email: user.email, 
                        joinedOn: user.joinedOn, 
                        country: user.country
                    });
                })
            });
            return;
        })
        .catch((error) => {
            res.status(500).json({
                message: `error occured when getting data from Db: ${error.toString()}`
            });
            return;
        });

})

router.post('/', (req, res, next) => {

    User
        .find({ email: req.body.email })
        .exec()
        .then((doc) => {
            if(doc.length >=1 ) {
                // user already exists
                res.status(409).json({
                    message: 'email already exists'
                });
                return;
            }
            // no duplicate user exists
            const _id = `${process.env.USR_ID_PRIVATE}-${new mongoose.Types.ObjectId()}`;
            const user = new User({
                _id: _id,
                country: req.body.country, 
                email: req.body.email, 
            })
            user
                .save()
                .then((result) => {
                    console.log(`user.route.js\n\t---->\n\t\t${result}`)
                    const token = jwt.sign({
                            _id: _id
                        },
                        process.env.JWT_PRIVATE, {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: "user successfully created", 
                        response: result, 
                        authToken: token
                    })
                })
                .catch((error) => {
                    console.log(`user.route.js\n\t---->\n\t\t${error}`)
                    return res.status(500).json({
                        message: `error occured when adding user to db`, 
                        error: error
                    })
                })
        })
        .catch((error) => {
            res.status(500).json({
                message: `error getting user data for duplication validation: ${error.toString()}`
            })
            return;
        })

})

router.post('/login', (req, res, next) => {

    User
        .find({ email: req.body.email })
        .exec()
        .then((doc) => {
            if(doc.length >= 1) {
                // user exists 
                // proceed to generate authToken
                const token = jwt.sign({
                        _id: doc[0]._id
                    },
                    process.env.JWT_PRIVATE, {
                        expiresIn: "1h"
                    }
                );
                res.status(200).json({
                    message: "successfully logged in", 
                    user: {
                        _id: doc[0]._id, 
                        email: doc[0].email, 
                        country: doc[0].country, 
                        joinedOn: doc[0].joinedOn, 
                        authToken: token
                    }
                })
                return;
            } else {
                res.status(401).json({
                    message: 'email does not exist'
                });
                return;
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: `error occured when getting user data for duplication verification: ${error.toString()}`
            });
            return;
        });

})

router.post("/auth", (req, res, next) => {

    const _id = req.body._id;
    console.log(`${_id.split('-')[0]}`)
    
    // checking _id authencity
    User    
        .find({ _id: _id })
        .exec()
        .then((doc) => {
            if(doc.length >= 1) {
                if(_id.split('-')[0] === process.env.USR_ID_PRIVATE) {
                    const token = jwt.sign({
                            _id: _id
                        },
                        process.env.JWT_PRIVATE, {
                            expiresIn: "1h"
                        }
                    );
                    res.status(200).json({
                        message: "auth success",
                        authToken: token
                    });
                    return;
                } else {
                    res.status(401).json({
                        message: "not authorized (invalid id)"
                    })
                    return;
                }
            } else {
                res.status(401).json({
                    message: "not authorized!"
                });
                return;
            }
        })
        .catch((error) => {
            res.status(500).json({
                message:`error occured when verifying existence of user: ${error.toString()}`
            })
            return;
        })

})

module.exports = router;