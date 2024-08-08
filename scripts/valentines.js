const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../App/index.js');
const PLAYERDATA = require('../modules/player.js');
const EMOJICONFIG = require('../config/emoji.json');
const config = require('../App/config.json');
const mongoose = require('mongoose');

mongoose
   .connect(config.mongodb, {})
   .then(() => console.log(`Valentines Event Ready`));

   async function sendEmbed(channel, embed, row) {
    const message = await channel.send({embeds: [embed], components: [row]});
    return message;
}


   async function run() {

    try {

        const channel = client.channels.cache.get('1171188493775544330');
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('first_click')
                    .setLabel('Open')
                    .setStyle(ButtonStyle.Success),
            );
            let min = 1800000; // 30 minutes
            let max = 3600000; // 60 minutes
            let randomtime = Math.floor(Math.random() * (max - min + 1) + min);
        const embed = new EmbedBuilder()
            .setTitle('Random Valentines Event')
            .setDescription(`${EMOJICONFIG.heart} You find a strange heart shapped box on the ground...`);
            let embedMessage = await sendEmbed(channel, embed, row);

        setInterval(async () => {
            embedMessage = await sendEmbed(channel, embed, row);
        }, randomtime);
       //  }, 3000); 
 

        const filter = i => i.customId === 'first_click';

        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if (!filter(interaction)) return;

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('first_click')
                    .setLabel('Open')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
            );
    

            const embed = new EmbedBuilder()
            .setTitle('Random Event')
            .setDescription(`${EMOJICONFIG.heart} you find...\n\n **NEW ITEM**: **Cupid's Bow (CUPID)**`);

            await interaction.reply({embeds: [embed], ephemeral: true, components: [row]});
            let userId = interaction.user.id;
            let playerStats = await PLAYERDATA.findOne({ userId: userId });
            let alreadyHasItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === Number(94));
            if (alreadyHasItem) {
                alreadyHasItem.amount += 1;
            } else {
            playerStats.player.stuff.stuffUnlock.push({
            id: 94,
            name: "Cupid's Bow",
            level: 1,
            amount: 1
            });
            }
            await playerStats.save();

            if (embedMessage) {
                embedMessage.delete();
            }
        

        });
    }
    catch (error) {
    }
}
module.exports = run;    