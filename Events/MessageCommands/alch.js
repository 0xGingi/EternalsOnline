const PLAYER = require('../../modules/player.js');
const STUFF = require('../../config/stuff.json');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const BALANCE = require('../../modules/economie.js');
const STATS = require('../../modules/statsBot.js')

module.exports = {
    name: Events.MessageCreate,
    /**
     * @param {Message} message
     */

async execute(message) {
    let stats = await STATS.findOne({ botID: 899 });

    if (message.mentions.users.first() !== client.user) return;
    const args = message.content.split(/ +/).slice(1);
    const commandName = args.shift().toLowerCase();
    if (this.info.names.some(name => commandName === name)) {
    var user = message.author;
        let player = await PLAYER.findOne({ userId: message.author.id }).exec();
        let balance = await BALANCE.findOne({ userId: message.author.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)
        const itemAlias = args[0];
        if (!itemAlias) {
            message.reply("Please specify an item to alch.");
            return;
        }


        const itemToAlch = player.player.stuff.stuffUnlock.find(i => {
            const stuffItem = STUFF.find(s => s.id === i.id);
            return stuffItem && stuffItem.equipalias && stuffItem.equipalias.toLowerCase() === itemAlias.toLowerCase();
        });
        if (!itemToAlch) {
            return message.reply(`The item "${itemAlias}" does not exist.`);
        }

        const stuffConfig = STUFF.find(i => i.id === itemToAlch.id);
        if (!stuffConfig) {
            message.reply(`The item ${itemAlias} cannot be alched.`);
            return;
        }
        let amount = args[1] === 'all' ? player.player.stuff.stuffUnlock.find(i => i.id === itemToAlch.id).amount : parseInt(args[1]) || 1;
        if (!itemAlias || !amount) {
            message.reply("Please specify an item and the amount.");
            return;
        }
        if (!itemToAlch || itemToAlch.amount < amount) {
            message.reply(`You do not have enough ${itemAlias} to alch.`);
            return;
        }


       // let countdown = 30;
       // message.reply(`${EMOJICONFIG.orb} You started alching ${amount} ${itemToAlch.name}. Please wait ${countdown} seconds...`).then(msg => {
            
       //     let countdownInterval = setInterval(() => {
      //          countdown--;
                //msg.edit(`You are cooking. Please wait ${countdown} seconds...`);
      //          if (countdown === 0) {
      //              clearInterval(countdownInterval);
                    performCooking();
      //          } }, 1000);


async function performCooking () {

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



                    const itemToAlch = player.player.stuff.stuffUnlock.find(i => {
                        const stuffItem = STUFF.find(s => s.id === i.id);
                        return stuffItem && stuffItem.equipalias && stuffItem.equipalias.toLowerCase() === itemAlias.toLowerCase();
                    });
            

        // Decrease the amount of the item or remove it if the amount is equal to the amount argument
        let amount = args[1] === 'all' ? player.player.stuff.stuffUnlock.find(i => i.id === itemToAlch.id).amount : parseInt(args[1]) || 1;

            itemToAlch.amount -= amount;
            stats.amoutItem -= amount;
            
        const stuffConfig = STUFF.find(i => i.id === itemToAlch.id);
        // Increase the player's balance
        const totalCost = stuffConfig.cost * amount;
        balance.eco.coins += totalCost;
        stats.amoutCoin += totalCost;            
        const magicXP = Math.abs(Math.floor(5 * amount));
        if (isNaN(magicXP)) {

            console.error('Calculated magicXP is NaN');
        
            return;
        
        }
        player.player.magic.xp += magicXP;
        player.player.magic.totalxp += magicXP;

        let fishingMessage = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${EMOJICONFIG.orb} Alchemy Results`);
        let fields = [];
        fields.push({ name: `You Alched`, value: `${EMOJICONFIG.orb} ${amount} ${itemToAlch.name} for ${EMOJICONFIG.coin}${totalCost}`});
        fields.push({ name: `XP Gained`, value: `${magicXP} XP`});


                            const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                            let sharedXpPercentage = 0;
                            let inparty = false;            
                            if (party && party.member.length > 1) {
                                inparty=true;
                            const additionalXPPerMember = Math.floor(magicXP * 0.02);
                            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(magicXP * 0.10));
                            sharedXpPercentage = (totalAdditionalXP / magicXP) * 100;
                                    let promises = party.member.map(async member => {
                                    if (member.id === message.author.id) Promise.resolve();
                                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                                    if (memberBalance) {
                                    memberBalance.player.magic.xp += totalAdditionalXP;
                                    memberBalance.player.magic.totalxp += totalAdditionalXP;
                                    let xpNeeded = xpToNextLevel(memberBalance.player.magic.level);
                                    let initialLevel = memberBalance.player.magic.level;
                                    while (memberBalance.player.magic.xp >= xpNeeded) {
                                        if (memberBalance.player.magic.level < 120) {
                                            memberBalance.player.magic.level += 1;
                                            memberBalance.player.magic.xp -= xpNeeded;
                                            xpNeeded = xpToNextLevel(memberBalance.player.magic.level);

                
                                        }
                                    }
                                    if (memberBalance.player.magic.level > initialLevel) { 
                                    const logChannel = client.channels.cache.get('1169491579774443660');
                                    var now = new Date();
                                    var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                                    var messageEmbed = new EmbedBuilder()
                                    .setColor('#D5EB0D')
                                    .setTitle(`Log ${date}`)
                                    .setDescription(`${EMOJICONFIG.orb} ${inlineCode(member.pseudo)} is now magic level **${memberBalance.player.magic.level}**!`);
                                    logChannel.send({embeds: [messageEmbed], ephemeral: true });    
                                }

                                 await memberBalance.save();
                            }
                        });
                        await Promise.all(promises);
                
                  //      }
                    }
                    let description;
                    let xpNeeded = xpToNextLevel(player.player.magic.level);
                    if (player.player.magic.xp >= xpNeeded) {
                        if (player.player.magic.level >= 120) {
                        }
                        else if (player.player.magic.level <= 120) {

                            while (player.player.magic.xp >= xpToNextLevel(player.player.magic.level)) {
                                player.player.magic.level += 1;
                                let xpNeeded = xpToNextLevel(player.player.magic.level - 1);
                                if (player.player.magic.xp >= xpNeeded) {
                                    player.player.magic.xp -= xpNeeded;
                                } else {
                                    player.player.magic.xp = 0;
                                }
                            }                            
                            fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.magic.level}.\n`});
                            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            
                            
                            const logChannel = client.channels.cache.get('1169491579774443660');
                            var now = new Date();
                            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                            var messageEmbed = new EmbedBuilder()
                            .setColor('#D5EB0D')
                            .setTitle(`Log ${date}`)
                            .setDescription(`${EMOJICONFIG.orb} ${inlineCode(user.username)} is now magic level **${player.player.magic.level}**!`);
                            logChannel.send({embeds: [messageEmbed], ephemeral: true });    
                        } } else{
                            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
                        }
                        fishingMessage.addFields(fields);
                        message.reply({ embeds: [fishingMessage] });
                        player.player.energy -= 2;
                        await player.save();
                        await balance.save();
                        await stats.save();

                    
    }  catch (error) {
        console.log(err);

};  } // });
}         

    
},
info: {
    names: ['alch'],
} 
};