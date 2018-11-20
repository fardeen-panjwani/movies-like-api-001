const express = require("express");
const router = new express.Router();

const User = require("../../models/user/user.model");

router.get('/', (req, res, next) => {
    
    // User
    //     .find({})
    //     .exec()
    //     .then(( docs ) => {
    //         res.status(200).json({
    //             count: docs.length, 
    //             data: docs
    //         })
    //     })
    res.status(200).json({
        message: "all OK!!!"
    })

})

module.exports = router;