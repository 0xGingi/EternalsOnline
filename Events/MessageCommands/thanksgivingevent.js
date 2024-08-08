const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const {client} = require('../../App/index.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, args, commandName) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {
            const channel = client.channels.cache.get('1171188493775544330');
        
     
            
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('first_click')
                    .setLabel('Follow')
                    .setStyle(ButtonStyle.Success),
            );
            let min = 1800000; // 30 minutes
            let max = 3600000; // 60 minutes
            let randomtime = Math.floor(Math.random() * (max - min + 1) + min);
        const embed = new EmbedBuilder()
            .setTitle('Random Event')
            .setDescription('🦃 It looks like a turkey is asking you to follow it...');

        setInterval(() => {
            channel.send({embeds: [embed], components: [row] })
            .then(message =>{
                embedMessage = message;
            });
        }, randomtime);
       //  }, 3000); 
 

        const filter = i => i.customId === 'first_click';

        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if (!filter(interaction)) return;
            const embed = new EmbedBuilder()
            .setTitle('Random Event')
            .setDescription('🦃 The Turkey has lead you to a axe...\n\n **NEW ITEM**: **Axe of Turkey Slaying (ATS)**');

            await interaction.reply({embeds: [embed], ephemeral: true});
            let userId = interaction.user.id;
            let playerStats = await PLAYERDATA.findOne({ userId: userId });
            let alreadyHasItem = playerStats.player.stuff.stuffUnlock.find(item => item.id === Number(52));
            if (alreadyHasItem) {
                alreadyHasItem.amount += 1;
            } else {
            playerStats.player.stuff.stuffUnlock.push({
            id: 52,
            name: "Axe of Turkey Slaying",
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
    },
    info: {
        names: ['thanksgiving'],
    }
    
};