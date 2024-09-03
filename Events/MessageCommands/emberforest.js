const PLAYER = require('../../modules/player.js');
const ORE = require('../../config/emberforest.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 8.64e7;
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


    try {

        let player = await PLAYER.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@Eternals energy')}`)

        if (player.player.woodcutting.level < 50) {
            message.reply("You need to be at least woodcutting level 50 to enter the ember forest");
            return;
        }
    
        if (player.player.cooldowns && player.player.cooldowns.emberforest) {
            const timeSinceLastDaily = new Date().getTime() - new Date(player.player.cooldowns.emberforest).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }


        player.player.cooldowns = player.player.cooldowns || {};
        player.player.cooldowns.emberforest = new Date().toISOString();
        player.player.energy -= 2;
        await player.save();

        performFishing();


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
            const eligibleOre = ORE;
            if (eligibleOre.length === 0){
                player.player.isFishing = false;
                await player.save();
                message.reply("No woodcutting nodes are eligible for your current woodcutting level in this area. Try going to another area.");
                return;
            }

            let totalChance = eligibleOre.reduce((total, ore) => total + ore.chance, 0);
            let random = Math.random() * totalChance;
            let sum = 0;
            let selectedOres = [];

            while (selectedOres.length < 2) {
                let random = Math.random() * totalChance;
                for (const ore of eligibleOre) {
                    random -= ore.chance;
                    if (random < 0 && !selectedOres.includes(ore)) {
                        selectedOres.push(ore);
                        break;
                    }
                }
            }            
            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.axe2} Ember Forest Woodcutting Results`);
            
            let fields = [];
            let totalXP = 0;
            let fishCaughtMessage = '';
            for (const selectedOre of selectedOres) {
            const oreCaught = Math.floor(Math.random() * 2000) + 500;
            const playerFish = player.player.stuff.logs.find(f => f.name === selectedOre.name);
            
            if (!playerFish) {
                player.player.stuff.logs.push({
                    id: selectedOre.id,
                    name: selectedOre.name,
                    amount: oreCaught
                });
            } else {
                playerFish.amount += oreCaught;
            }



            const oreXP = selectedOre.xp * oreCaught;
            player.player.woodcutting.xp += oreXP;
            player.player.woodcutting.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.wood2} ${oreCaught} ${selectedOre.name}\n`;
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
                    let promises = party.member.map(async member => {
                    if (member.id === message.author.id) Promise.resolve();
                    let memberBalance = await PLAYER.findOne({ userId: member.id });
                    if (memberBalance) {
                    memberBalance.player.woodcutting.xp += totalAdditionalXP;
                    memberBalance.player.woodcutting.totalxp += totalAdditionalXP;
                 await memberBalance.save();
            }
        });
        await Promise.all(promises);

    }

    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            const xpNeeded = xpToNextLevel(player.player.woodcutting.level);
            player.player.isFishing = false;
            if (player.player.woodcutting.xp >= xpNeeded) {
                if (player.player.woodcutting.level >= 120) {
                }
                else if (player.player.woodcutting.level <= 120) {

                    while (player.player.woodcutting.xp >= xpToNextLevel(player.player.woodcutting.level)) {
                        player.player.woodcutting.level += 1;
                        player.player.woodcutting.xp -= xpToNextLevel(player.player.woodcutting.level);
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


            } }
             else {
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
        }
        fishingMessage.addFields(fields);
        message.reply({ embeds: [fishingMessage] });
    await player.save();
} catch (err) {
    console.log(err);
} }
        
    }
    catch (error) {
        console.log(err);

};
        }
    },

info: {
    names: ['ef','emberforest'],
}
    }