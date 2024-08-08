const Discord = require('discord.js');
const Player = require('../../modules/player.js');
const Areas2 = require('../../config/areas.json');
const Areas = require('../../modules/area.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const {client} = require('../../App/index.js');
const EMOJICONFIG = require('../../config/emoji.json');

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
     
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const newArea = args[1];
    const user = message.author;
   // let Areas = Areas;
    let player = await Player.findOne({ userId: user.id });
    let playerLevel = player.player.level;
    if (!player) return message.reply(`${EMOJICONFIG.no} you are not a player ! : ${inlineCode('@FlipMMO start')}`);
    else {
    let checkarea = await Areas.findOne({ areaname: newArea });
    if (!checkarea) {
        
            const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${EMOJICONFIG.map} Travel`)
            .setDescription('choose a area to travel to');

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select-action')
                    .setPlaceholder(`Select a area`)
                  //  .setEmoji(`${EMOJICONFIG.scroll4}`)
                    .addOptions([
                        {
                            label: 'Lumby - Level 1',
                            description: `A humble village where many adventures start their journey `,
                            value: 'lumby',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: 'Emberfall - Level 5',
                            description: 'A small castle town known for its blacksmiths',
                            value: 'emberfall',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Highlands - Level 10',
                            description: 'A mountainous region with a small village',
                            value: 'highlands',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: '$GONEville - Level 15',
                            description: 'Its $GONE',
                            value: 'goneville',
                            emoji: `${EMOJICONFIG.map}`,
                        },

                        {
                            label: 'The Astrals - Level 20',
                            description: 'A mysterious place where the stars are close',
                            value: 'astrals',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Ethereal - Level 30',
                            description: 'A place where the dead roam',
                            value: 'ethereal',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Polyzeal - Level 40',
                            description: 'A kingdom with poweful warriors',
                            value: 'polyzeal',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Underworld - Level 65',
                            description: 'A dangerous underground city with many dangers',
                            value: 'underworld',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Rektlands - Level 70',
                            description: 'A kingdom devistated by war',
                            value: 'rektlands',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Mountstone - Level 75',
                            description: 'A mountain range known for its powerful monsters',
                            value: 'mountstone',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Royal Realm - Level 80',
                            description: 'The central kingdom known for the royal knights',
                            value: 'royalrealm',
                            emoji: `${EMOJICONFIG.map}`,

                        },
                        {
                            label: 'Ascension - Level 90',
                            description: 'A place where the gods reside',
                            value: 'ascension',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: `Donald's Cave - Level 99`,
                            description: `Donald's Cave, you shouldn't enter`,
                            value: 'donaldscave',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: `Barren Wasteland - Level 100`,
                            description: `A barren wasteland with no life in sight`,
                            value: 'barrens',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: `Eastlands - Level 110`,
                            description: `A kingdom far east known for its mystical energy`,
                            value: 'eastlands',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: `Bloodlands - Level 120`,
                            description: `A land filled with blood and death`,
                            value: 'bloodlands',
                            emoji: `${EMOJICONFIG.map}`,
                        },
                        {
                            label: `The Wilderness - Level 1`,
                            description: `PvP Enabled Area - Beware of other players`,
                            value: 'wilderness',
                            emoji: `${EMOJICONFIG.map}`,
                        }
                    ]),
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;

    
        const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.SelectMenu, time: 15000 });

        collector.on('collect', async (interaction) => {
            try {
           // await interaction.deferUpdate().catch(console.error);
            const selectedValue = interaction.values[0];
            let areaLevel = Areas2.find(area => area.name === selectedValue).level;
           // if (playerLevel < areaLevel) {
           //     return interaction.reply(`${EMOJICONFIG.no} You are not high enough level to enter ${selectedValue}!`);
           // }
            player.player.other.area = selectedValue;
            await player.save();
    
            var itemEmbed = new EmbedBuilder()
                .setColor('#6d4534')
                .setTitle(`${EMOJICONFIG.map} ${user.username}'s Journey`)
                .setDescription(`${client.users.cache.get(user.id).username} has traveled a long distance to reach ${selectedValue}`)
                .setTimestamp();
            await interaction.reply({embeds: [itemEmbed], ephemeral: false});
    
                            
            
        } catch (error) {
            console.log(error);
        }
        });
        collector.on('end', collected => {
            
        });
        
        return;
        }
        

    else {
        function areaExist(newArea){
            for(let pas = 0; pas < Areas2.length; pas++){
                for(const name of Areas2[pas].name){
                    if(newArea == name) return [true, Areas[pas].id, Areas[pas].name]
                }
            }
            return [false, 0, 'undefined']
        }
        let areaLevel = Areas2.find(area => area.name === newArea).level;
        if(playerLevel < areaLevel) {
            return message.reply(`${EMOJICONFIG.no} You are not high enough level to enter ${newArea}!`);
        }


        if(areaExist(newArea)[0]){
            function alreadyHere(){
                for(const itemPlayerAll of player.player.other.area){
                    if(itemPlayerAll.id === areaExist(newArea)[1]) return true
                }
                return false
            }
            
            if(alreadyHere()) return message.reply(`${EMOJICONFIG.no} You are already in ${areaExist(newArea)[2]}!`);


        }
        else {
                        // [========== Button Travel ==========]
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('yes')
                                .setLabel('Travel')
                                .setEmoji(`${EMOJICONFIG.yes}`)
                                .setStyle(ButtonStyle.Success),
                            
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel('CANCEL')
                                .setEmoji(`${EMOJICONFIG.no}`)
                                .setStyle(ButtonStyle.Danger),
                        );
                        
                        const buyItemEmbed = new EmbedBuilder()
                            .setColor('#4dca4d')
                            .setTitle(`${EMOJICONFIG.map} Travel to ${newArea}`)
                            .setDescription(`${client.users.cache.get(user.id).username}, Travel to ${newArea}?`)
                            .setTimestamp();
                        const msg = await message.reply({ embeds: [buyItemEmbed], components: [row] });
                                // ========== Filter & Collector ==========
                                const collector = msg.createMessageComponentCollector({
                                    componentType: ComponentType.Button,
                                    max: 1,
                                    time: 70_000
                                });
                            
                                collector.on('collect', async interaction => {
                                    if (interaction.customId == 'yes') {

                                        player.player.other.area = newArea
                                        player.save()


                                        var itemEmbed = new EmbedBuilder()
                                        .setColor('#6d4534')
                                        .setTitle(`${EMOJICONFIG.map} ${user.username}'s Journey`)
                                        .setDescription(`${client.users.cache.get(user.id).username} has traveled a long distance to reach ${newArea}`)
                                        .setTimestamp()
                                        await interaction.reply({embeds: [itemEmbed], ephemeral: false});
        
                                            
                                    };
                                    if(interaction.customId === 'no') await interaction.reply({content: `You canceled`, ephemeral: true});
                                });
                            }    } }
                         
    };
    
    
},
info: {
    names: ['travel', 't'],
}
}
