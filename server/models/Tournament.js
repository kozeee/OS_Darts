const mongoose = require('mongoose')

const tournamentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Mode:{
        type: String,
        required:true,
        default:"singles"
    },
    Bar:{
        type: String,
        required:true
    },
    Date:{
        type: String,
        required: true
    },
    Winners:{
        type: Array,
        default:[]
    }
})

module.exports = mongoose.model('Tournaments', tournamentSchema)