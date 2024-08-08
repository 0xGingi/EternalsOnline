const PLAYER = require('../../modules/player.js');
const TREES = require('../../config/woodcut.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 1200000;

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
 
            var user = message.author;

            try {
                let player = await PLAYER.findOne({ userId: user.id }).exec();
                if (!player) {
                    message.reply("You are not a player yet.");
                    return;
                }
                if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)


                const currentArea = player.player.other.area;
                const eligibleTrees = TREES.filter(tree => 
                    player.player.woodcutting.level >= tree.level && 
                    tree.area.includes(currentArea)
                );
                if (eligibleTrees.length === 0){
                    message.reply("No logs are eligible for your current woodcutting level in this area. Try going to another area.");
                    return;
                }

                if (player.player.cooldowns && player.player.cooldowns.skilling) {
                    const cooldownData = player.player.cooldowns.skilling;
                    const timeSinceLastFight = new Date().getTime() - cooldownData.timestamp;
                    if (timeSinceLastFight < cooldownData.duration) {
                        var measuredTime = new Date(null);
                        measuredTime.setSeconds(Math.ceil((cooldownData.duration - timeSinceLastFight) / 1000));
                        var MHSTime = measuredTime.toISOString().substr(11, 8);
                        message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                        return;
                    }
                }    
                player.player.cooldowns = player.player.cooldowns || {};
                player.player.cooldowns.skilling = {
                    timestamp: new Date().getTime(),
                    duration: shuffleTime
                };
                await player.save();
        

                let countdown = 20 * 60; // Set your own countdown for woodcutting
                message.reply(`You started ${EMOJICONFIG.axe2} woodcutting. Please wait 20 Minutes...`).then(msg => {
                    let countdownInterval = setInterval(() => {
                        countdown--;
                        if (countdown === 0) {
                            clearInterval(countdownInterval);
                            performWoodcutting();
                        }
                    }, 1000);

                    async function performWoodcutting() {
                        try {
                            function xpToLevel(level) {
                                let total = 0;
                                for (let l = 1; l < level; l++) {
                                    total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
                                }
                                return Math.floor(total / 4);
                            }

                            function xpToNextLevel(currentLevel) {
                                return xpToLevel(currentLevel + 1) - xpToLevel(currentLevel);
                            }


                            const player = await PLAYER.findOne({ userId: user.id });  
                            const currentArea = player.player.other.area;
                            const eligibleTrees = TREES.filter(tree => 
                                player.player.woodcutting.level >= tree.level && 
                                tree.area.includes(currentArea)
                            );

                            if (eligibleTrees.length === 0){
                                message.reply("No logs are eligible for your current woodcutting level in this area. Try going to another area.");
                                return;
                            }
                
                            const numLogTypes = Math.floor(Math.random() * 4) + 2;
                            const selectedTrees = [];
                            for (let i = 0; i < numLogTypes; i++) {
                                const log = eligibleTrees[Math.floor(Math.random() * eligibleTrees.length)];
                                selectedTrees.push(log);
                            }

                            let fishingMessage = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(`${EMOJICONFIG.axe2} Idle Woodcutting Results`);
                            
                            let fields = [];
                            let totalXP = 0;
                            let fishCaughtMessage = '';
                            for (const log of selectedTrees) {
                            let logsCut = Math.floor(Math.random() * 120) + 1; // Change this to adjust the maximum number of fish that can be caught
                            const playerLogs = player.player.stuff.logs.find(f => f.name === log.name);
                            if (player.player.other.ironman === true) {
                                logsCut = Math.floor(logsCut * 1.2);
                            }
                            
                            if (!playerLogs) {
                                player.player.stuff.logs.push({
                                    id: log.id,
                                    name: log.name,
                                    amount: logsCut
                                });
                            } else {
                                playerLogs.amount += logsCut;
                            }
                

                            let woodcuttingXP = Math.abs(Math.floor(log.xp * logsCut));
                            if (player.player.other.ironman === true) {
                                woodcuttingXP = Math.floor(woodcuttingXP * 1.2);
                            }

                            player.player.woodcutting.xp += woodcuttingXP;
                            player.player.woodcutting.totalxp += woodcuttingXP;

                            totalXP += woodcuttingXP;
                            fishCaughtMessage += `${EMOJICONFIG.wood2} ${logsCut} ${log.name}\n`;
                        }
                        fields.push({ name: `You chopped`, value: fishCaughtMessage });
                            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                            let sharedXpPercentage = 0;
                            let inparty = false;            
                            if (party && party.member.length > 1) {
                                inparty = true;
                            const additionalXPPerMember = Math.floor(totalXP * 0.02);
                            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(totalXP * 0.10));
                            sharedXpPercentage = (totalAdditionalXP / totalXP) * 100;

                             //   for (const member of party.member) {
                                    let promises = party.member.map(async member => {
                                    if (member.id === message.author.id) Promise.resolve();
                                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                                    if (memberBalance) {
                                    memberBalance.player.woodcutting.xp += totalAdditionalXP;
                                    memberBalance.player.woodcutting.totalxp += totalAdditionalXP;
                                   /*
                                    let xpNeeded = xpToNextLevel(memberBalance.player.woodcutting.level);
                                    let initialLevel = memberBalance.player.woodcutting.level;
                                    while (memberBalance.player.woodcutting.xp >= xpNeeded) {
                                        if (memberBalance.player.woodcutting.level < 99) {
                                            memberBalance.player.woodcutting.level += 1;
                                            memberBalance.player.woodcutting.xp -= xpNeeded;
                                            xpNeeded = xpToNextLevel(memberBalance.player.woodcutting.level);

                                            
            
                                        }
                                    }
                                    if (memberBalance.player.woodcutting.level > initialLevel) {
                                    const logChannel = client.channels.cache.get('1169491579774443660');
                                    var now = new Date();
                                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                    var messageEmbed = new EmbedBuilder()
                                    .setColor('#D5EB0D')
                                    .setTitle(`Log ${date}`)
                                    .setDescription(`${EMOJICONFIG.axe2} ${inlineCode(member.pseudo)} is now woodcutting level **${memberBalance.player.woodcutting.level}**!`);
                                    logChannel.send({embeds: [messageEmbed], ephemeral: true });
                                    }
                           */
                                 await memberBalance.save();
                            }
                        });
                        await Promise.all(promises);
                
                    // }
                    }
                    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });


                            let xpNeeded = xpToNextLevel(player.player.woodcutting.level);
                            if (player.player.woodcutting.xp >= xpNeeded) {
                                if (player.player.woodcutting.level >= 120) {
                                }
                                else if (player.player.woodcutting.level <= 120) {

                                    while (player.player.woodcutting.xp >= xpToNextLevel(player.player.woodcutting.level)) {
                                        player.player.woodcutting.level += 1;
                                        let xpNeeded = xpToNextLevel(player.player.woodcutting.level - 1);
                                        if (player.player.woodcutting.xp >= xpNeeded) {
                                            player.player.woodcutting.xp -= xpNeeded;
                                        } else {
                                            player.player.woodcutting.xp = 0;
                                        }
                                    }                                      

                                    fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.woodcutting.level}.\n`});
                                    if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});

                                const logChannel = client.channels.cache.get('1169491579774443660');
                                var now = new Date();
                                var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                var messageEmbed = new EmbedBuilder()
                                .setColor('#D5EB0D')
                                .setTitle(`Log ${date}`)
                                .setDescription(`${EMOJICONFIG.axe2} ${inlineCode(user.username)} is now woodcutting level **${player.player.woodcutting.level}**!`);
                                logChannel.send({embeds: [messageEmbed], ephemeral: true });
                    

                            } } else {
                                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                            }
                            fishingMessage.addFields(fields);
                            message.reply({ embeds: [fishingMessage] });
                            player.player.energy -= 2;            
                            await player.save();
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
            }
            catch (error) {
                console.log(error);
            };
        }
    },

    info: {
        names: ['idlechop'],
    }
}