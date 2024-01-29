const mongoose = require('mongoose')

const barSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Location:{
        type: String
    }
    
})

module.exports = mongoose.model('Bars', barSchema)