const Discord = require('discord.js');
const Player = require('../../modules/player.js');
const STATS = require('../../modules/statsBot.js');
const SQUADDATA = require('../../modules/squad.js')
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCEDATA = require('../../modules/economie.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { prefix } = require('../../App/config.json')
const configLevel = require('../../config/configLevel.json');
const Party = require('../../modules/party.js');
const seeds = require('../../config/seeds.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
    
        var user = message.author;
        const action = args[0];
        const crop = args[1];
        let amount = args[2];

        let playerStats = await Player.findOne({ userId: user.id });
        let balance = await BALANCEDATA.findOne({ userId: user.id });

        async function xpToLevel(level) {
            let total = 0;
            for (let l = 1; l < level; l++) {
                total += Math.floor(l + 300 * Math.pow(2, l / 7.0));
            }
            return Math.floor(total / 4);
        }
    
        async function xpToNextLevel(currentLevel) {
            return await xpToLevel(currentLevel + 1) - await xpToLevel(currentLevel);
        }



        if (!playerStats) return message.reply(`${inlineCode('❌')} you are not a player ! : ${inlineCode('@Eternals start')}`);
        else {

            if (!action) {
                let farminglevel = playerStats.player.farming.level;
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`${user.username}'s Farm Plots`)
                    .setColor('#0099ff');
            
                    Object.keys(playerStats.player.farming.plots)
                    .sort((a, b) => a - b)
                    .forEach(key => {
                    const plot = playerStats.player.farming.plots[key];
                    const plotNumber = key.replace('plot', '');
                    if (farminglevel < plot.level) {
                        embed.addFields({ name: `${EMOJICONFIG.blank}\nPlot ${plotNumber}`, value: `Locked (Requires level ${plot.level})`, inline: true});
                    } else if (plot.planted) {
                        const remainingTime = Math.max(0, plot.timestamp + plot.duration - Date.now());
                        if (Date.now() >= plot.timestamp + plot.duration) {
                            embed.addFields({ name: `${EMOJICONFIG.sunflower1}\nPlot ${plotNumber}`, value: `Planted: ${plot.amount} x ${plot.seed}\nStatus: Ready to be harvested`, inline: true});
                        } else {
                            const remainingMinutes = Math.round(remainingTime / 60000);
                            embed.addFields({ name: `${EMOJICONFIG.flower1}\nPlot ${plotNumber}`, value: `Planted: ${plot.amount} x ${plot.seed}\nHarvest in: ${remainingMinutes} minutes`, inline: true});
                        }
                    } else {
                            embed.addFields({ name: `${EMOJICONFIG.blank}\nPlot ${plotNumber}`, value: `Empty`, inline: true});
                    }
                });
            
                message.reply({ embeds: [embed] });
            }
            else if (action === 'plant') {
                if (!crop) return message.reply('You need to specify a crop to plant');
                const seedInfo = seeds.find(seed => seed.plantalias === crop);
                if (!seedInfo) {
                    return message.reply(`Invalid seed type: ${plantalias}`);
                }
                let playerSeed = playerStats.player.stuff.seeds.find(seed => seed.name === seedInfo.name || seed.id === seedInfo.id);
                if (!playerSeed) {
                    return message.reply(`You don't have any ${seedInfo.name} seeds`);
                }
                if (playerSeed.amount <= 0) {
                    return message.reply(`You don't have any ${seedInfo.name} seeds left to plant`);
                }                
                                            
                if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Crop Harvest`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .setFooter({ text: 'Eternals Farming'});


                let farminglevel = playerStats.player.farming.level;
                const plotKey = Object.keys(playerStats.player.farming.plots).find(key => 
                    !playerStats.player.farming.plots[key].planted && 
                    farminglevel >= playerStats.player.farming.plots[key].level
                );
                if (!plotKey) return message.reply('No empty plots available or plots matching your level');
                if (playerSeed.amount < amount) {
                    return message.reply(`You don't have ${amount} ${crop} seeds`);
                }  
                let duration = seedInfo.duration
                let level = seedInfo.level;
                let id = seedInfo.id;
                let cropname = seedInfo.crop.name;
                let cropid = seedInfo.crop.id;
                let name = seedInfo.name;
              
                if (playerStats.player.farming.level < level) return message.reply(`You need to be level ${level} to plant ${crop}`);

                if (amount === 'all') {
                    amount = playerSeed.amount;
                }
                else if (!amount) {
                    amount = 1;
                }
                else {
                    amount = amount;
                    if (isNaN(amount) || amount < 1) {
                        return message.reply('Invalid amount specified');
                    }
                }
                playerSeed.amount -= amount;
                //playerStats.player.stuff.seeds.find(seed => seed.plantalias === crop).amount -= amount;
                playerStats.player.farming.plots[plotKey] = {
                    cropid: cropid,
                    cropname: cropname,
                    seed: name,
                    planted: true,
                    timestamp: Date.now(),
                    duration: duration,
                    level: level,
                    amount: amount
                };
                playerStats.player.energy -= 2;
                await playerStats.save();               
                const plotNumber = plotKey.replace('plot', '');
                battleEmbed.addFields(
                    { name: `Plot ${plotNumber}`, value: `You planted ${amount} ${crop} seeds\nIt will be ready to harvest in ${duration / 60000} minutes\n Check your progress with ${inlineCode(`@Eternals farm`)}` },
                );
                message.channel.send({ embeds: [battleEmbed] });
            }
            else if (action === 'harvest') {
                let harvested = false;
                if (playerStats.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)
                var battleEmbed = new Discord.EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`${user.username} Crop Harvest`)
                .setDescription(`\n`)
                .setThumbnail('https://images.discordapp.net/avatars/1157454837861056552/c8d66bd2b5f32dbf44e3bdd2d3f61489.png')
                .setFooter({ text: 'Eternals Farming'});
                let leveledUp = false;
                const harvestPromises = Object.keys(playerStats.player.farming.plots).map(async key => {
                    const plot = playerStats.player.farming.plots[key];
                    if (plot.planted && Date.now() >= plot.timestamp + plot.duration) {
                        const seedName = plot.seed;
                        const cropAmount = plot.amount * (Math.floor(Math.random() * 5) + 1);
                        const seed = seeds.find(seed => seed.name === seedName);
                        const cropName = seed.crop[0].name;
                        const seedXP = seed.xp;
                        const cropID = seed.crop[0].id;
                        const cropIndex = playerStats.player.stuff.crops.findIndex(crop => crop.name === cropName);
                        if (cropIndex === -1) {
                            playerStats.player.stuff.crops.push({ id: cropID, name: cropName, amount: cropAmount });
                        } else {
                            playerStats.player.stuff.crops[cropIndex].amount += cropAmount;
                        }
                        playerStats.player.farming.xp += Math.abs(Math.floor(cropAmount * seedXP));
                        playerStats.player.farming.totalxp += Math.abs(Math.floor(cropAmount * seedXP));
                        let xpNeeded = await xpToNextLevel(playerStats.player.farming.level);
                        const plotNumber = key.replace('plot', '');
                        battleEmbed.addFields(
                            { name: `Crop Yield from Plot ${plotNumber}`, value: `You harvested ${cropAmount} ${cropName} and gained ${cropAmount * seedXP} XP!` },
                        );

                        playerStats.player.farming.plots[key] = {
                            seed: '',
                            planted: false,
                            timestamp: 0,
                            duration: 0,
                            level: 0,
                            amount: 0,
                            cropid: 0,
                            cropname: ''
                        };
            
                        harvested = true;
                        if (playerStats.player.farming.xp >= xpNeeded) {
                            if (playerStats.player.farming.level >= 120) {
                            }
                            else if (playerStats.player.farming.level <= 120) {
                                while (playerStats.player.farming.xp >= await xpToNextLevel(playerStats.player.farming.level)) {
                                    playerStats.player.farming.level += 1;
                                    let xpNeeded = await xpToNextLevel(playerStats.player.farming.level - 1);
                                    if (playerStats.player.farming.xp >= xpNeeded) {
                                        playerStats.player.farming.xp -= xpNeeded;
                                    } else {
                                        playerStats.player.farming.xp = 0;
                                    }
                                }
                                        } }                        
                    }
                });
                await Promise.all(harvestPromises).then(() => {
            
                if (!harvested) {
                    return message.reply(`You have no crops that are ready to be harvested`);
                }
            });
            if (leveledUp) {
                battleEmbed.addFields({ name: `Congratulations! You leveled up!`, value: `Your new farming level is ${playerStats.player.farming.level}.\n`});
                const logChannel = client.channels.cache.get('1169491579774443660');
                var now = new Date();
                var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                var messageEmbed = new EmbedBuilder()
                .setColor('#D5EB0D')
                .setTitle(`Log ${date}`)
                .setDescription(`${EMOJICONFIG.hoe2} ${inlineCode(user.username)} is now farming level **${playerStats.player.farming.level}**!`);
                logChannel.send({embeds: [messageEmbed], ephemeral: true });
            }
            playerStats.player.energy -= 2;
            await playerStats.save();
            message.channel.send({ embeds: [battleEmbed] });

        }
            }
        }
    },
    info: {
        names: [
            'farming', 'farm'
        ]
    }
};