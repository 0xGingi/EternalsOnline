const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
    
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.attack} Select a Dungeon`)
            .setDescription('Choose a dungeon to challange');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-action')
                    .setPlaceholder(`Select a dungeon`)
                  //  .setEmoji(`${EMOJICONFIG.scroll4}`)
                    .addOptions([
                        {
                            label: 'Horrific Caverns - Level ??',
                            description: 'Caverns filled with horrors',
                            value: 'horrificcaverns',
                            emoji: `${EMOJICONFIG.skull}`,
                        }

                    ]),
            );

      //  await message.reply({ embeds: [embed], components: [row] }).then(sentMessage => {
        const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

        //console.log('Message sent, setting up collector');


        const filter = (interaction) => interaction.user.id === message.author.id;

    
        const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 15000 });
       // console.log('collector created', collector);

        collector.on('collect', async (interaction) => {
         //  console.log('fired')
            try {
              //  console.log(interaction);

            await interaction.deferUpdate().catch(console.error);
            const selectedValue = interaction.values[0];

            switch (selectedValue) {
                case 'horrificcaverns':
                    await require('./partydungeon.js').execute(message, args, 'pdf hc');
                    break;              
            }
           // collector.stop();
        } catch (error) {
            console.log(error);
        }
        });
        collector.on('end', collected => {
            
       });
      //  collector.on('end', collected);
    }
    },
    info: {
        names: ['partydungeon', 'pd'],
    }
};