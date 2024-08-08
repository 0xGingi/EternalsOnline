const mongoose = require('mongoose');


const partySchema = mongoose.Schema({

    partyName: String,

    leader: Array,

    member: Array,

    banned: Array,

    lastDungeon: {
    type: Date,
    default: null
},
dungeonHorrificCavernsProgress: Number,


});


module.exports = mongoose.model('Party', partySchema);