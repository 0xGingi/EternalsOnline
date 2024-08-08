const mongoose = require('mongoose')

const areaSchema = mongoose.Schema({
    areaid : Number,
    areaname: String,
})

module.exports = mongoose.model('Area', areaSchema)
