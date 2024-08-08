const mongoose = require('mongoose');


const partySchema = mongoose.Schema({

    partyName: String,

    leader: Array,

    member: Array,

    banned: Array,

});


module.exports = mongoose.model('Party', partySchema);