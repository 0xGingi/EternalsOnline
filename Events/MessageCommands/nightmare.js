const PLAYER = require('../../modules/player.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const Party = require('../../modules/party.js');
const EMOJICONFIG = require('../../config/emoji.json');
const shuffleTime = 8.64e7;
const ORE = require('../../config/nightmarezone.json')
const BALANCEDATA = require('../../modules/economie.js');

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
        let balance = await BALANCEDATA.findOne({ userId: user.id }).exec();
        if (!player) {
            message.reply("You are not a player yet.");
            return;
        }
        if (player.player.energy < 2) return message.reply(`${EMOJICONFIG.no} You don't have enough energy! Restore your energy with ${inlineCode('@FlipMMO energy')}`)

        if (player.player.level < 50) {
            message.reply("You need to be at least level 50 to enter the nightmare zone");
            return;
        }
    
        if (player.player.cooldowns && player.player.cooldowns.nightmare) {
            const timeSinceLastDaily = new Date().getTime() - new Date(player.player.cooldowns.nightmare).getTime();
            if (timeSinceLastDaily < shuffleTime) {
                var measuredTime = new Date(null);
                measuredTime.setSeconds(Math.ceil((shuffleTime - timeSinceLastDaily) / 1000));
                var MHSTime = measuredTime.toISOString().substr(11, 8);
                message.channel.send(`${EMOJICONFIG.hellspawn} Please wait \`${MHSTime}\` and try again.`);
                return;
            }
        }


       // let countdown = 3600;
        player.player.cooldowns = player.player.cooldowns || {};
        player.player.cooldowns.nightmare = new Date().toISOString();
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
                await player.save();
                message.reply("Huh... No Zombies are found?");
                return;
            }
            console.log("check1");
            let totalChance = eligibleOre.reduce((total, ore) => total + ore.chance, 0);
            let random = Math.random() * totalChance;
            let sum = 0;
            let selectedOres = [];

            while (selectedOres.length < 2) {
                let randomIndex = Math.floor(Math.random() * eligibleOre.length);
                let selectedOre = eligibleOre[randomIndex];
                if (!selectedOres.includes(selectedOre)) {
                    selectedOres.push(selectedOre);
                }
            }                
            
            console.log("check2");
            let fishingMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.necromancy} Nightmare Zone Results`);
            
            let fields = [];
            let totalXP = 0;
            let fishCaughtMessage = '';
            
        for (const selectedOre of selectedOres) {
            const oreCaught = Math.floor(Math.random() * 600) + 350;
            const oreXP = Math.abs(Math.floor(selectedOre.xp * oreCaught));
            balance.eco.xp += oreXP;
            balance.eco.totalxp += oreXP;

            totalXP += oreXP;
            fishCaughtMessage += `${EMOJICONFIG.skull} ${oreCaught} ${selectedOre.name}\n`;

        }
        console.log("check3");
        console.log("check4");
        fields.push({ name: `You Killed`, value: fishCaughtMessage });
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
                    let memberBalance = await BALANCEDATA.findOne({ userId: member.id });
                    if (memberBalance) {
                    memberBalance.eco.xp += totalAdditionalXP;
                    memberBalance.eco.totalxp += totalAdditionalXP;
                 await memberBalance.save();
            }
        });
        await Promise.all(promises);

   //     }
    }
    console.log("check5");
    fields.push({ name: `Total XP Gained`, value: `${totalXP} XP!` });

            let xpNeeded = xpToNextLevel(player.player.level);
            if (balance.eco.xp >= xpNeeded) {
                if (player.player.level >= 120) {
                }
                else if (player.player.level <= 120) {

                    while (balance.eco.xp >= xpToNextLevel(player.player.level)) {
                        player.player.level += 1;
                        let xpNeeded = xpToNextLevel(player.player.level - 1);
                        if (balance.eco.xp >= xpNeeded) {
                            balance.eco.xp -= xpNeeded;
                        } else {
                            balance.eco.xp = 0;
                        }
                    }
        
                    fields.push({ name: `Congratulations! You leveled up!`, value: `Your new level is ${player.player.level}.\n`});
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});

            const logChannel = client.channels.cache.get('1169491579774443660');
            var now = new Date();
            var date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
            var messageEmbed = new EmbedBuilder()
            .setColor('#D5EB0D')
            .setTitle(`Log ${date}`)
            .setDescription(`${EMOJICONFIG.attack6} ${inlineCode(user.username)} is now level **${player.player.level}**!`);
            logChannel.send({embeds: [messageEmbed], ephemeral: true });


            } }
             else {
                if(inparty) fields.push({ name: `XP Shared With Party`, value: `${sharedXpPercentage.toFixed(0)}%\n`});
        }
        fishingMessage.addFields(fields);
        message.reply({ embeds: [fishingMessage] });
    await player.save();
    await balance.save();
} catch (err) {
    console.log(err);
} }
        
}
    catch (error) {
        console.log(error);

};
        }
    },

info: {
    names: ['nightmare','nightmarezone', 'nmz'],
}
    }