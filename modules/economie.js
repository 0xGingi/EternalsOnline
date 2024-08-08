const mongoose = require('mongoose')

const economieSchema = mongoose.Schema({
    userId: String,
    pseudo: String,
    eco: {
        coins: Number,
        xp: Number,
        elo: Number,
        totalxp: Number
    },
})

module.exports = mongoose.model('Economie', economieSchema)
