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
            .setTitle('Select an Action')
            .setDescription('Choose a action to complete');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-action')
                    .setPlaceholder(`Select a action`)
                  //  .setEmoji(`${EMOJICONFIG.scroll4}`)
                    .addOptions([
                        {
                            label: 'Idle Fight',
                            description: 'Idle Fight Monsters',
                            value: 'idle_fight',
                            emoji: `${EMOJICONFIG.attack}`,
                        },
                        {
                            label: 'Idle Mine',
                            description: 'Idle Mine Ore',
                            value: 'idle_mine',
                            emoji: `${EMOJICONFIG.pickaxe2}`,

                        },
                        {
                            label: 'Idle Fish',
                            description: 'Idle Fish',
                            value: 'idle_fish',
                            emoji: `${EMOJICONFIG.fishpole}`,
                        },
                        {
                            label: 'Idle Chop',
                            description: 'Idle Chop Wood',
                            value: 'idle_chop',
                            emoji: `${EMOJICONFIG.axe2}`,

                        },
                        {
                            label: 'Idle Agility',
                            description: 'Idle Run Laps',
                            value: 'idle_lap',
                            emoji: `${EMOJICONFIG.boots2}`,

                        },                        
                        {                            
                            label: 'Fight',
                            description: 'Fight Monsters',
                            value: 'fight',
                            emoji: `${EMOJICONFIG.attack}`,
                        },
                        {
                            label: 'Mine',
                            description: 'Mine Ore',
                            value: 'mine',
                            emoji: `${EMOJICONFIG.pickaxe2}`,

                        },
                        {
                            label: 'Fish',
                            description: 'Fish',
                            value: 'fish',
                            emoji: `${EMOJICONFIG.fishpole}`,
                        },
                        {
                            label: 'Chop',
                            description: 'Chop Wood',
                            value: 'chop',
                            emoji: `${EMOJICONFIG.axe2}`,
                        },
                        {
                            label: 'Agility',
                            description: 'Run Laps',
                            value: 'lap',
                            emoji: `${EMOJICONFIG.boots2}`,
                        },



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
                case 'idle_fight':
                    await require('./idlefight.js').execute(message, args, 'idlefight');
                    break;
                case 'idle_mine':
                    await require('./idlemine.js').execute(message, args, 'idlemine');
                    break;
                case 'idle_fish':
                    await require('./idlefish.js').execute(message, args, 'idlefish');
                    break;
                case 'idle_chop':
                    await require('./idlechop.js').execute(message, args, 'idlechop');
                    break;   
                    
                case 'fight':
                    await require('./monster.js').execute(message, args, 'fight');
                    break;
                case 'mine':
                    await require('./mine.js').execute(message, args, 'mine');
                    break;
                case 'fish':
                    await require('./fish.js').execute(message, args, 'fish');
                    break;
                case 'chop':
                    await require('./woodcut.js').execute(message, args, 'chop');
                    break;   
                case 'lap':
                    await require('./agility.js').execute(message, args, 'lap');
                    break;
                case 'idle_lap':
                    await require('./idleagility.js').execute(message, args, 'idlelap');
                    break;
              
            }
           // collector.stop();
        } catch (error) {
            console.log(error);
        }
        });
        collector.on('end', collected => {
            
        });
        //collector.on('end', collected);
    }
    },
    info: {
        names: ['action', 'a'],
    }
};