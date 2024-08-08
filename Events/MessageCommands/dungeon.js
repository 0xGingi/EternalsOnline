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
                            label: 'Goblin Cave - Level 10',
                            description: 'A cave infested with goblins',
                            value: 'goblincave',
                            emoji: `${EMOJICONFIG.skull}`,
                        },
                        {
                            label: 'Eternal Mountain - Level 20',
                            description: 'A mountain range with mythical monsters',
                            value: 'eternalmountain',
                            emoji: `${EMOJICONFIG.skull}`,

                        },
                        {
                            label: 'Drudic Forest - Level 30',
                            description: 'A mystical forest protected by a cult of druids',
                            value: 'drudicforest',
                            emoji: `${EMOJICONFIG.skull}`,
                        },
                        {
                            label: 'Thieves cove - Level 40',
                            description: 'A cove filled with a powerful group of thieves',
                            value: 'thievescove',
                            emoji: `${EMOJICONFIG.skull}`,

                        },
                        {
                            label: 'Underworld City - Level 65',
                            description: 'A underworld city filled with horrors',
                            value: 'underworldcity',
                            emoji: `${EMOJICONFIG.skull}`,

                        },
                        {
                            label: 'Tombs of the Dead - Level 70',
                            description: 'A tomb filled with the dead',
                            value: 'tombsofthedead',
                            emoji: `${EMOJICONFIG.skull}`,
                        },
                        {
                            label: 'Cosmic Shard - Level 80',
                            description: 'A Strange rift into the cosmos',
                            value: 'cosmicshard',
                            emoji: `${EMOJICONFIG.skull}`,

                        },
                        {
                            label: 'Ancient Catacombs - Level 90',
                            description: 'An ancient catacomb filled with untold riches',
                            value: 'ancientcatacombs',
                            emoji: `${EMOJICONFIG.skull}`,

                        },
                        {
                            label: 'Witches Tower - Level 100',
                            description: 'A tower filled with witches in a barren wasteland... suspicious...',
                            value: 'witchestower',
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
                case 'goblincave':
                    await require('./dungeonfight.js').execute(message, args, 'df gc');
                    break;
                case 'eternalmountain':
                    await require('./dungeonfight.js').execute(message, args, 'df em');
                    break;
                case 'drudicforest':
                    await require('./dungeonfight.js').execute(message, args, 'df df');
                    break;
                case 'thievescove':
                    await require('./dungeonfight.js').execute(message, args, 'df tc');
                    break;
                case 'cosmicshard':
                    await require('./dungeonfight.js').execute(message, args, 'df cs');
                    break;   
                case 'ancientcatacombs':
                    await require('./dungeonfight.js').execute(message, args, 'df ac');
                    break;
                case 'underworldcity':
                    await require('./dungeonfight.js').execute(message, args, 'df uw');
                    break;
                case 'tombsofthedead':
                    await require('./dungeonfight.js').execute(message, args, 'df totd');
                    break;
                case 'witchestower':
                    await require('./dungeonfight.js').execute(message, args, 'df witt');
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
        names: ['dungeon', 'dung'],
    }
};