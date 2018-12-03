const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.Mixed
    },
    
    email: {
        type: String, 
        required: true
    }, 

    joinedOn: {
        type: String,
        default: `${new Date().getDay() + 1}/${new Date().getMonth() + 1}/${new Date().getFullYear()} at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    },

    country: {
        type: String, 
        required: true
    }

})

module.exports = mongoose.model("User", userSchema);