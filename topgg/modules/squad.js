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
    bossKill: Number,
}
})

module.exports = mongoose.model('Squad', squadSchema)