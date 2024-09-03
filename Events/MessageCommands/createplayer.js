const PLAYER = require('../../modules/player.js')
const ECONOMIE = require('../../modules/economie.js')
const STATS = require('../../modules/statsBot.js')
const BOSS = require('../../modules/boss.js')
const BOSSCONFIG = require('../../config/boss.json')
const { EmbedBuilder, Message, Events } = require('discord.js');
const { inlineCode } = require('@discordjs/builders')
const AREA = require('../../modules/area.js')
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');


module.exports = {
    name: Events.MessageCreate,
     /**
     * @param {Message} message
     */
     async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
 
    var user = message.author
    var input = args[0];
    
    var playerCreateEmbed = new EmbedBuilder()
        .setColor('#9696ab')
        .setTitle(`${EMOJICONFIG.yes} ${user.username}'s Account`)
        .setDescription(`${EMOJICONFIG.scroll4} : The bot is in Beta version, if there is a problem/bug, please let us know.`)
        .setTimestamp();
    



    try {    
    let stats = await STATS.findOne({ botID: 899 });


    // ======= ACCOUNT PLAYER =======
    let player = await PLAYER.findOne({userId: user.id});
            if (!player) {
                var accountPLayer = new PLAYER({
                    userId: user.id,
                    pseudo: user.username,
                    player: {
                        level: 1,
                        elo: 1500,
                        petelo:1500,
                        fishing:{
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        cooking:{
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        woodcutting: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        mining: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        smithing: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        crafting: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        magic: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },    
                        taming: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        agility: {
                            level: 1,
                            xp: 0,
                            totalxp: 0
                        },
                        slayer:{
                            level: 1,
                            xp: 0,
                            totalxp: 0,
                            points: 0,
                            task:{
                                monster: "",
                                kills: 0,
                                neededKills: 0,
                            },
                        },
                        farming: {
                            level: 1,
                            xp: 0,
                            totalxp: 0,
                            plots:{
                                plot1:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 1,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,
                                },
                                plot2:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 20,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,

                                },
                                plot3:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 40,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,

                                },
                                plot4:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 60,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,

                                },
                                plot5:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 80,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,

                                },
                                plot6:{
                                    seed: "",
                                    planted: false,
                                    timestamp: 0,
                                    duration: 0,
                                    level: 99,
                                    cropid: 0,
                                    cropname: "",
                                    amount: 0,

                                },
                            }
                            },
                        potion: {
                            name: "",
                            id: 0,
                            attack: 0,
                            defense: 0,
                            crit: 0,
                            dodge: 0
                        },
                        level: 1,
                        attack: 100,
                        defense: 20,
                        health: 2500,
                        dodge: 0,
                        crit: 0,
                        penetration: 0,
                        lifeSteal: 0,
                        isFishing: false,
                        isCooking: false,
                        energy: 100,
                        slotItem: {
                            slot1: -1,
                            slot2: -1,
                            slot3: -1,
                            slot4: -1,
                            slot5: -1,
                        },
                        activePet: {
                            id: -1,
                            name: 'undefined',
                            nickname: 'undefined',
                        },
                        pets: [],
                        stuff: {
                            stuffUnlock: [
                                {id: 1, name: 'Bronze Sword', level: 1, amount: 1},
                                {id: 6, name: 'Bronze Shield', level: 1, amount: 1}                    
                            ],
                            weaponID: -1,
                            bootsID: -1,
                            armorID: -1,
                            magicItemID: -1,
                            fish: [],
                            food: [],
                            logs: [],
                            ore: [],
                            bars: [],
                            potions: [],
                            crops: [],
                            seeds: []
                        },
                        bank :{
                            coins: 0,
                            stuffUnlock: [],
                        },
                        other:{
                            dm: false,
                            bossattack: 0,
                            squadName: 'undefined',
                            partyName: 'undefined',
                            squadCoinGiven: 0,
                            monsterKill: 0,
                            box: 1,
                            rarebox: 0,
                            topggbox: 0,
                            orepack: 0,
                            fishpack: 0,
                            logpack: 0,
                            petbox: 0,                  
                            area: 'lumby',
                            dungeonGoblinCaveProgress: 0,
                            dungeonEtherealMountainProgress: 0,
                            dungeonDrudicForestProgress: 0,
                            dungeonThievesCoveProgress: 0,
                            dungeonCosmicShardProgress: 0,
                            dungeonAncientCatacombsProgress: 0,
                            dungeonUnderWorldCityProgress: 0,
                            dungeonTombsoftheDeadProgress: 0,
                            dungeonWitchesTowerProgress: 0,
                            topggVotes: 0,
                            topggStreak: 0,
                            topggLastVoted: 0,
                            slayerdungeonFloor: 0,
                            towerFloor: 1,
                            ironman: input === 'ironman' ? 'true' : 'false',
                        },
                        cooldowns:{
                            daily: 0,
                            worldBoss: 0,
                            beg: 0,
                            guildAttack: 0,
                            guildTourn: 0,
                            guildReward: 0,
                            guildRaid: 0,
                            motherload: 0,
                            barbarian: 0,
                            emberforest: 0,
                            gathering: 0,
                            funkyfarm: 0,
                            nightmare: 0,
                            skilling: {
                                timestamp: 0,
                                duration: 0
                            },
                            fighting: {
                                timestamp: 0,
                                duration: 0
                            },
                            dungeon: 0,
                            trainpet: 0,
                            catchpet: 0,
                
                        }
                    },
                });
            accountPLayer.save();

            stats.numberPlayer += 1;
            stats.save();


            playerCreateEmbed.addFields([

                { name: `${EMOJICONFIG.yes} Account created !`, value: `${EMOJICONFIG.attack} New player joins the adventure!` }
            
            ]);            }
        
   
    let economie = await ECONOMIE.findOne({ userId: user.id });
            if (!economie) {
                var economiePLayer = new ECONOMIE({
                    userId: user.id,
                    pseudo: user.username,
                    eco: {
                        coins: 0,
                        xp: 0,
                        totalxp: 0
                    },
                })
            economiePLayer.save()

            playerCreateEmbed.addFields([

                { name: `${EMOJICONFIG.yes} Player Setup!`, value: `${EMOJICONFIG.coinchest} You get a common box and some starting equipment!\n\n Please run @Eternals tutorial!` }
            
            ]);            message.reply({ embeds: [playerCreateEmbed] })

            } else {
                message.reply(`${EMOJICONFIG.no} You are already a player... !`);
            };
        
         } catch (error) {

            console.error(error);
        }

    }
},
info: {
    names: ['create', 'start', 'account', 'newaccount', 'begin'],
}
     }    
