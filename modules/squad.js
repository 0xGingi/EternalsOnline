const mongoose = require('mongoose')

const squadSchema = mongoose.Schema({
    squadName : String,
    squadXp: Number,
    leader: Array,
    member: Array,
    officer: Array,
    banned: Array,
    squadbank: Number,
    squadboss: {
        bossattack: Number,
        bosshealth: Number,
        bossdefense: Number,
    },
    stuff: {
        stuffUnlock : [
            {
                id: Number,
                name: String,
                level: Number,
                amount: Number
            }
        ],
        raid: [
            {
                id: Number,
                name: String,
                level: Number,
                amount: Number
            }
        ],
        weaponID: Number,
        bootsID: Number,
        armorID: Number,
        magicItemID: Number

},
other : {
    raidnzothprogress: Number,
    raidcityofhatredprogress: Number,
    bossKill: Number,
},
lastRaid: {
    type: Date,
    default: null
}
})

module.exports = mongoose.model('Squad', squadSchema)