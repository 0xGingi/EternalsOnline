const Discord = require('discord.js');
const BOSSDATA = require('../../modules/boss.js')
const BALANCEDATA = require('../../modules/economie.js');
const PLAYERDATA = require('../../modules/player.js');
const CONFIGBOSS = require('../../config/boss.json')
const CONFIGPLAYER = require('../../config/configLevel.json')
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, Collection } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const EMOJICONFIG = require('../../config/emoji.json');

const shuffleTime = 8.64e7;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

    async execute(message, args, commandName) {
        //  const args = message.content.slice(prefix.length).trim().split(/ +/);
       //   const commandName = args.shift().toLowerCase();
       if (this.info.names.some(name => commandName === name)) {
      

    var user = message.author

    /**=== Account Player ===*/
    let playerStats = await PLAYERDATA.findOne({ userId: message.author.id });
    if (!playerStats) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
    if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

    else {
        if (playerStats.player.cooldowns && playerStats.player.cooldowns.worldBoss) {
            const timeSinceLastDaily = new Date().getTime() - new Date(playerStats.player.cooldowns.worldBoss).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }
    
        /**=== Account Boss ===*/
        let boss = await BOSSDATA.findOne({ idboss: 8 });
        if (!boss) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {
            /**=== Account Economie ===*/
            let balance = await BALANCEDATA.find();
            if (!balance) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@Eternals start')}`);
            else {
                if(boss.stats.health >= 0){
                    // ==== Boss Attack Player ====
                    var damage = Math.floor(Math.random() * playerStats.player.attack)
                    var damageBoss = Math.floor(Math.random() * boss.stats.attack) + 1
                    //var damage = 0
                    //var damageBoss = 0

                    // === Balance Player ===
                    let balancePlayer = await BALANCEDATA.findOne({userId: user.id});
                    if (!balancePlayer) return message.reply(`${EMOJICONFIG.no} this person is not a player ! : ${inlineCode('@Eternals start')}`);
                    else {
                        
                        message.reply(`${EMOJICONFIG.attack6} You attack the boss **${boss.bossname}** and do ${inlineCode(damage + ' dmg')}\n${EMOJICONFIG.attack6} The Boss attacks you and does ${inlineCode(damageBoss + ' dmg')}`) 
                        playerStats.player.energy -= 2;

                        // add dammage :
                        playerStats.player.other.bossattack += damage
                        // clear health player : 
                        playerStats.player.health -= damageBoss
                        if(playerStats.player.health <= 0) playerStats.player.health = 0
                        
                        // ==== Player loses ====
                        if(playerStats.player.health <= 0){
                            // ==== Initialize Lose Coin ====
                            var losecoin10 = Math.floor((balancePlayer.eco.coins*10)/100)

                            message.reply(`You die... and lose 10% of your coin: ${losecoin10}`)

                            // delete coins of user : 
                            balancePlayer.eco.coins -= losecoin10
                            if(balancePlayer.eco.coins <= 0) balancePlayer.eco.coins = 0

                            balancePlayer.save()

                            if(playerStats.player.level === 0) playerStats.player.health = CONFIGPLAYER.level0.stats.health
                            if(playerStats.player.level === 1) playerStats.player.health = CONFIGPLAYER.level1.stats.health
                            if(playerStats.player.level === 2) playerStats.player.health = CONFIGPLAYER.level2.stats.health
                            if(playerStats.player.level === 3) playerStats.player.health = CONFIGPLAYER.level3.stats.health
                            if(playerStats.player.level === 4) playerStats.player.health = CONFIGPLAYER.level4.stats.health
                            if(playerStats.player.level === 5) playerStats.player.health = CONFIGPLAYER.level5.stats.health
                            if(playerStats.player.level === 6) playerStats.player.health = CONFIGPLAYER.level6.stats.health
                            if(playerStats.player.level === 7) playerStats.player.health = CONFIGPLAYER.level7.stats.health
                            if(playerStats.player.level === 8) playerStats.player.health = CONFIGPLAYER.level8.stats.health
                            if(playerStats.player.level === 9) playerStats.player.health = CONFIGPLAYER.level9.stats.health
                            if(playerStats.player.level === 10) playerStats.player.health = CONFIGPLAYER.level10.stats.health
                            if(playerStats.player.level === 11) playerStats.player.health = CONFIGPLAYER.level11.stats.health
                            if(playerStats.player.level === 12) playerStats.player.health = CONFIGPLAYER.level12.stats.health
                            if(playerStats.player.level === 13) playerStats.player.health = CONFIGPLAYER.level13.stats.health
                            if(playerStats.player.level === 14) playerStats.player.health = CONFIGPLAYER.level14.stats.health
                            if(playerStats.player.level === 15) playerStats.player.health = CONFIGPLAYER.level15.stats.health
                        }
                        playerStats.player.cooldowns = playerStats.player.cooldowns || {};
                        playerStats.player.cooldowns.worldBoss = new Date();
                        await playerStats.save()
    
                        boss.stats.health -= damage
                        boss.save()
                    }
                }

                // ==== Boss Death - Player WIN ====
                if(boss.stats.health <= 0){
                    message.reply(`${EMOJICONFIG.scroll4} **The boss is killed !**\nEach Participant who sees the boss attacked will receive a bonus!`)

                    // == Log : ==
                    const logChannel = client.channels.cache.get('1169491579774443660');
                    var now = new Date();
                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    var messageEmbed = new EmbedBuilder()
                        .setColor('#f15a2d')
                        .setTitle(`Log ${date}`)
                        .setDescription(`${EMOJICONFIG.scroll4} **BOSS KILLED !** by **${inlineCode(user.username)}**\n${EMOJICONFIG.paper} All players who participated in the fight will receive their reward (xp and a rarebox!)`);
                    logChannel.send({embeds: [messageEmbed], ephemeral: true });



                    const allPLayer = await PLAYERDATA.find()

                    for(const userDB of allPLayer){
                        if(userDB.player.other.bossattack >= 1){

                            for(const userBAL of balance){
                                if(userDB.userId == userBAL.userId){
                                    let currentPlayerStats = await PLAYERDATA.findOne({ userId: userDB.userId });
                                    currentPlayerStats.player.other.rarebox += 1
                                    currentPlayerStats.player.other.bossattack = 0
                                    currentPlayerStats.player.cooldowns = playerStats.player.cooldowns || {};
                                    currentPlayerStats.player.cooldowns.worldBoss = new Date();
                                
                                    await currentPlayerStats.save()
                                }
                            }
                            // Generate New Boss
                            function newBoss(name, health, attack){
                                boss.stats.health = health
                                boss.stats.attack = attack
                                boss.bossname = name
                            }

                            var randomBoss = Math.floor(Math.random() * 10) + 1
                            if(randomBoss == 1) newBoss(CONFIGBOSS.boss1.name, CONFIGBOSS.boss1.health, CONFIGBOSS.boss1.attack)
                            if(randomBoss == 2) newBoss(CONFIGBOSS.boss2.name, CONFIGBOSS.boss2.health, CONFIGBOSS.boss2.attack)
                            if(randomBoss == 3) newBoss(CONFIGBOSS.boss3.name, CONFIGBOSS.boss3.health, CONFIGBOSS.boss3.attack)
                            if(randomBoss == 4) newBoss(CONFIGBOSS.boss4.name, CONFIGBOSS.boss4.health, CONFIGBOSS.boss4.attack)
                            if(randomBoss == 5) newBoss(CONFIGBOSS.boss5.name, CONFIGBOSS.boss5.health, CONFIGBOSS.boss5.attack)
                            if(randomBoss == 6) newBoss(CONFIGBOSS.boss6.name, CONFIGBOSS.boss6.health, CONFIGBOSS.boss6.attack)
                            if(randomBoss == 7) newBoss(CONFIGBOSS.boss7.name, CONFIGBOSS.boss7.health, CONFIGBOSS.boss7.attack)
                            if(randomBoss == 8) newBoss(CONFIGBOSS.boss8.name, CONFIGBOSS.boss8.health, CONFIGBOSS.boss8.attack)
                            if(randomBoss == 9) newBoss(CONFIGBOSS.boss9.name, CONFIGBOSS.boss9.health, CONFIGBOSS.boss9.attack)
                            if(randomBoss == 10) newBoss(CONFIGBOSS.boss10.name, CONFIGBOSS.boss10.health, CONFIGBOSS.boss10.attack)
                        };
                    };
                    boss.save();
                };
            };
        };
    };
};
},
info: {
    names: ['bossattack', 'attackboss', 'bossA', 'bossa', 'ba', 'BA'],
} }
