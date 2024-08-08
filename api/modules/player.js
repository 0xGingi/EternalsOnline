const mongoose = require('mongoose')

const playerSchema = mongoose.Schema({
    userId: String,
    pseudo: String,
    player: {
        level: Number,
        attack: Number,
        defense: Number,
        health: Number,
        dodge: Number,
        crit: Number,
        penetration: Number,
        lifeSteal: Number,
        elo: Number,
        petelo: Number,
        isFishing: Boolean,
        isCooking: Boolean,
        energy: Number,
        potion: {
            name: String,
            id: Number,
            attack: Number,
            defense: Number,
            dodge: Number,
            crit: Number,
        },
        fishing: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        cooking: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        woodcutting: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        mining: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        smithing: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        crafting: {
            level: Number,
            xp: Number,
            totalxp: Number
            
        },
        magic: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        taming: {
            level: Number,
            xp: Number,
            totalxp: Number
        },
        agility: {
            level: Number,
            xp: Number,
            totalxp: Number 
        },
        slayer: {
            level: Number,
            xp: Number,
            totalxp: Number,
            points: Number,
            task: {
                monster: String,
                kills: Number,
                neededKills: Number,
            },
        },
        farming: { 
            level: Number,
            xp: Number,
            totalxp: Number,
            plots: {
                plot1: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number
                },
                plot2: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number

                },
                plot3: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number

                },
                plot4: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number

                },
                plot5: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number

                },
                plot6: {
                    seed: String,
                    planted: Boolean,
                    timestamp: Number,
                    duration: Number,
                    level: Number,
                    cropid: Number,
                    cropname: String,
                    amount: Number

                }
            },
        },
        slotItem: {
            slot1: Number,
            slot2: Number,
            slot3: Number,
            slot4: Number,
            slot5: Number,
        },
        activePet: {
            id: Number,
            name: String,
            nickname: String,
        },
        pets:[
            {
                id: Number,
                name: String,
                level: Number,
                experience: Number,
                nickname: String,
                attack: Number,
                defense: Number,
                health: Number,
            }
        ],
        stuff: {
            stuffUnlock : [
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
            magicItemID: Number,
            fish: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
        
            ],
            food: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
        
            ],
            logs: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
        
            ],
            ore: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                },
            ],
            bars: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
            ],
            gem: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
            ],
            potions: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
            ],
            seeds: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
            ],
            crops: [
                {      
                    id: Number,      
                    name: String,       
                    amount: Number      
                }
            ],
        },
        bank : {
            coins: Number, 
            stuffUnlock : [
                {
                    id: Number,
                    name: String,
                    level: Number,
                    amount: Number
                }
            ],  
        },
        other:{
            dm: Boolean,
            bossattack: Number,
            squadName: String,
            squadCoinGiven: Number,
            partyName: String,
            monsterKill: Number,
            box: Number,
            rarebox: Number,
            topggbox: Number,
            orepack: Number,
            fishpack: Number,
            logpack: Number,
            area: String,
            dungeonGoblinCaveProgress: Number,
            dungeonEtherealMountainProgress: Number,
            dungeonDevitoIslandProgress: Number,
            dungeonDrudicForestProgress: Number,
            dungeonThievesCoveProgress: Number,
            dungeonCosmicShardProgress: Number,
            dungeonAncientCatacombsProgress: Number,
            dungeonUnderWorldCityProgress: Number,
            dungeonTombsoftheDeadProgress: Number,
            topggVotes: Number,
            topggLastVoted: Date,
            topggStreak: Number,
            slayerdungeonFloor: Number,
            towerFloor: Number,
        },
        cooldowns:{
            daily: Date,
            worldBoss: Date,
            beg: Date,
            guildAttack: Date,
            guildTourn: Date,
            guildReward: Date,
            guildRaid: Date,
            motherload: Date,
            catchpet: Date,
            trainpet: Date,
            barbarian: Date,
            emberforest: Date,
            gathering: Date,
            funkyfarm: Date,
            nightmare: Date,
            skilling: {
                timestamp: Number,
                duration: Number
            },
            fighting: {
                timestamp: Number,
                duration: Number
            },
            dungeon: Date,
        }
    },
})

module.exports = mongoose.model('Player', playerSchema)
