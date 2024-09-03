const PLAYER = require('../../modules/player.js');
const POTIONS = require('../../config/potions.json');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 30000;
const crops = require('../../config/crops.json');

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


    var user = message.author;
    var userPotion = args[0];
    if (!userPotion) {
        message.reply(`You need to specify a potion to brew! ${inlineCode(`@Eternals list potions`)}`);
        return;
    }
    let player = await PLAYER.findOne({ userId: user.id }).exec();
    if (!player) {
        message.reply(`You are not a player! ${inlineCode(`@Eternals start`)}`);
        return;
    }
    if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

    var potion = POTIONS.find(potion => potion.eatalias.toLowerCase() === userPotion.toLowerCase());
    if (!potion) {
        message.reply(`That potion does not exist! ${inlineCode(`@Eternals list potions`)}`);
        return;
    }
    var crop = crops.find(crop => crop.name.toLowerCase() === potion.eatalias.toLowerCase());
    var playerCrop = player.player.stuff.crops.find(c => c.name === crop.name);
    if (!playerCrop || playerCrop.amount <= 0) {
        message.reply(`You do not have any ${crop.name} to brew ${potion.name}.`);
        return;
    }
    

    if (player.player.magic.level < potion.level) {
        message.reply(`You need to be magic level ${potion.level} to brew ${potion.name}`);
        return;
    }
    /*
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
    */
    player.player.energy -= 2;
    await player.save();
        performCooking();

async function performCooking () {

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
    function calculateSuccessRate(cookingLevel) {
        const failureRate = (120 - cookingLevel) / 98 * 0.5;
        return 1 - failureRate;
    }

    var potion = POTIONS.find(potion => potion.eatalias.toLowerCase() === userPotion.toLowerCase());
    var crop = crops.find(crop => crop.name.toLowerCase() === potion.eatalias.toLowerCase());
    var playerCrop = player.player.stuff.crops.find(c => c.name === crop.name);
    if (!playerCrop || playerCrop.amount <= 0) {
        message.reply(`You do not have any ${crop.name} to brew ${potion.name}.`);
        return;
    }

    const successRate = calculateSuccessRate(player.player.magic.level);
    const amountToCook = playerCrop.amount;
    const cookedAmount = Math.floor(amountToCook * successRate);
    const failedAmount = amountToCook - cookedAmount;
    if (isNaN(cookedAmount) || isNaN(failedAmount)) {
        console.error('Calculated cookedAmount or failedAmount is NaN');
        return;
    }

    playerCrop.amount -= amountToCook;
    
    const playerPotion = player.player.stuff.potions.find(c => c.name === potion.name);
    if (!playerPotion) {
        player.player.stuff.potions.push({ id: potion.id, name: potion.name, amount: cookedAmount });
    }
    else {
        playerPotion.amount += cookedAmount;
    }
    const xpGained = potion.xp * cookedAmount;
    player.player.magic.xp += xpGained;
    player.player.magic.totalxp += xpGained;

    let fishingMessage = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`${EMOJICONFIG.mana3} Brewing Results`);
    let fields = [];
    fields.push({ name: `You Brewed`, value: `${cookedAmount} ${potion.name} and failed ${failedAmount}`});
    fields.push({ name: `XP Gained`, value: `${xpGained} XP`});
    
    const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
    let sharedXpPercentage = 0;
    let inparty = false;            
    if (party && party.member.length > 1) {
        inparty=true;
    const additionalXPPerMember = Math.floor(xpGained * 0.02);
    const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(xpGained * 0.10));
    sharedXpPercentage = (totalAdditionalXP / xpGained) * 100;
        let promises = party.member.map(async member => {
            if (member.id === message.author.id) return;
            let memberBalance = await PLAYER.findOne({ userId: member.id });
            if (memberBalance) {
            memberBalance.player.magic.xp += totalAdditionalXP;
            memberBalance.player.magic.totalxp += totalAdditionalXP;
        }
         await memberBalance.save();
        });
    }

    const xpNeeded = xpToNextLevel(player.player.magic.level);
    if (player.player.magic.xp >= xpNeeded) {
        if (player.player.magic.level >= 120) {
        }
        else if (player.player.magic.level <= 120) {

            while (player.player.magic.xp >= xpToNextLevel(player.player.magic.level)) {
                player.player.magic.level += 1;
                player.player.magic.xp -= xpToNextLevel(player.player.magic.level);
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


await player.save();
}
}
},
info: {
    names: ['brew'],
}
};