const PLAYER = require('../../modules/player.js');
const AGILITY_COURSES = require('../../config/agility.json');
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
        const eligibleCourses = AGILITY_COURSES.filter(course => 
            player.player.agility.level >= course.level && 
            course.area.includes(currentArea)
        );

        if (eligibleCourses.length === 0) {
            message.reply("No agility courses are eligible for your current agility level in this area. Try going to another area.");
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


        let countdown = 20 * 60;
        message.reply(`You started ${EMOJICONFIG.boots2} running idle laps. Please wait 20 Minutes...`).then(msg => {
            let countdownInterval = setInterval(() => {
            countdown--;
                 if (countdown === 0) {

                    clearInterval(countdownInterval);
                    performFishing();
                 } }, 1000);

        async function performFishing() {
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
            const eligibleCourses = AGILITY_COURSES.filter(course => 
                player.player.agility.level >= course.level && 
                course.area.includes(currentArea));

            if (eligibleCourses.length === 0) {
                message.reply("No agility courses are eligible for your current agility level in this area. Try going to another area.");
                player.player.cooldowns = player.player.cooldowns || {};
                player.player.cooldowns.skilling = {
                    timestamp: 0,
                    duration: shuffleTime
                };
                await player.save();
                return;
            }


            const course = eligibleCourses[0];
            const laps = Math.floor(Math.random() * 120) + 1;
            var agilityXP = Math.abs(Math.floor(course.xp * laps));
            
            if (player.player.other.ironman === true) {
                agilityXP = Math.floor(agilityXP * 1.2);
            }

            player.player.agility.xp += agilityXP;
            player.player.agility.totalxp += agilityXP;
            
            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.boots2} Agility Results`);
            let fields = [];
            fields.push({ name: `You Ran`, value: `${EMOJICONFIG.boots2} ${laps} laps in ${course.name}`});
            fields.push({ name: `XP Gained`, value: `${agilityXP} XP`});
                const party = await Party.findOne({ member: { $elemMatch: { id: message.author.id } } });
                let sharedXpPercentage = 0;
                let inparty = false;
            if (party && party.member.length > 1) {
                inparty = true;
            const additionalXPPerMember = Math.floor(agilityXP * 0.02);
            const totalAdditionalXP = Math.min(additionalXPPerMember * party.member.length, Math.floor(agilityXP * 0.10));
             sharedXpPercentage = (totalAdditionalXP / agilityXP) * 100;
                   let promises = party.member.map(async member => {
                    if (member.id === message.author.id)  return;
                    
                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                    if (memberBalance) {
                    memberBalance.player.agility.xp += totalAdditionalXP;
                    memberBalance.player.agility.totalxp += totalAdditionalXP;
                 await memberBalance.save();
            }
       });
    }

            let xpNeeded = xpToNextLevel(player.player.agility.level);
            if (player.player.agility.xp >= xpNeeded) {
                if (player.player.agility.level >= 120) {
                }
                else if (player.player.agility.level <= 120) {
                    while (player.player.agility.xp >= xpToNextLevel(player.player.agility.level)) {
                        player.player.agility.level += 1;
                        let xpNeeded = xpToNextLevel(player.player.agility.level - 1);
                        if (player.player.agility.xp >= xpNeeded) {
                            player.player.agility.xp -= xpNeeded;
                        } else {
                            player.player.agility.xp = 0;
                        }
                    }
            fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.agility.level}.\n`});
            if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.boots2} ${inlineCode(user.username)} is now agility level **${player.player.agility.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });


            } }
             else {
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
        }

        fishingMessage.addFields(fields);
        message.reply({ embeds: [fishingMessage] });
        player.player.energy -= 2;
    await player.save();
} catch (err) {
    console.log(err);
} }
        
    });
    }
    catch (error) {
        console.log(err);

};
        }
    },

info: {
    names: ['idlelap'],
}
    }