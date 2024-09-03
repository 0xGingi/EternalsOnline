const Discord = require('discord.js');
const PLAYERDATA = require('../../modules/player.js');
const EMOJICONFIG = require('../../config/emoji.json');
const CONFIGITEM = require('../../config/stuff.json')
const { numStr } = require('../../functionNumber/functionNbr.js')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const cookConfig = require('../../config/cook.json');
const BALANCEDATA = require('../../modules/economie.js');
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Discord.Collection();

module.exports = {
    name: Events.MessageCreate,
    
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
 
    var user = message.author

    let playerStats = await PLAYERDATA.findOne({ userId: user.id });
    let balance = await BALANCEDATA.findOne({ userId: user.id });
        const tutorialPages = [

            { title: 'Eternals Tutorial Page 1', content: '**Welcome to the tutorial for Eternals!**\n\nThis text dump will get you started on the right track as a new player! \n To Interact with the bot mention the bot with <@1157454837861056552> - For example: <@1157454837861056552> action \n\n**@Eternals profile** - This gives you an overview of your profile \n\n**@Eternals inv** - This allows you to view the items you have \n\n**@Eternals daily**- This will reward you with box every 24 hours. You can open this reward by using **@Eternals open common**\n\n**@Eternals help** - Use this command at any time to see the complete list of game commands\n\n' },
            { title: 'Eternals Tutorial Page 2', content: 'Great now lets move onto the gameplay basics!\n\n**@Eternals action** - This is an easy way to fight monsters for experience & loot as well as training various skills (You can train a skill and fight at the same time) \n\nA good early gameplay loop is focusing on fighting monsters and training your fishing skill so you have food to heal yourself in-between battles! \n\nIf you do not want to use **@Eternals action** you can simply use **@Eternals fight** and while you are waiting for the cooldown to fight the next monster use the command **@Eternals fish** to catch raw fish\n\n Use **@Eternals inv** and click on the Skilling tab to see the fish you have caught then use **@Eternals cook <fishname>** to cook all of the selected fish\n\nNow that you have some edible food to heal health simply use **@Eternals eat <fishname> <amount>** to eat and heal your health (If your health reaches 0 you will die and lose 10% of your held gold coins)\n\n' },
            { title: 'Eternals Tutorial Page 3', content: '**Time to get geared up!**\n\nUse **@Eternals inv** to check what items/gear you currently have (You will notice you were gifted a **Bronze Sword [BS]** and **Bronze Shield [BSH]** when you started!)\n\nNext to each item in bold is the alias which you can use to quickly equip and unequip gear - **@Eternals equip <itemalias>**\n\nTry using **@Eternals equip BS** and **@Eternals equip BSH**\n\n These commands will equip your Bronze Sword in slot 1 and your Bronze Shield in slot 2 (There is a total of 5 gear slots)\n\nSimply use **@Eternals unequip <slotnumber>** to remove an item from a gear slot!\n\nYou can also use **@Eternals stats <itemalias>** to view the stats of any item within the game '  },
            { title: 'Eternals Tutorial Page 4', content: '**Its time for you to start playing!**\n\nNow you know the basics get out there and start training your skills, fighting monsters and looting awesome gear to become more powerful!\n\nYou can use **@Eternals travel** and move to a new area with stronger monsters, more places to train your skills and get even better loot drops! Area levels are just suggested levels, not a requirement!\n\nRemember at any time use **@Eternals help** to see the full list of things you can do within Eternals and enjoy exploring all the content!'  },

            // Add more pages as needed
        
        ];

        var tutorialEmbeds = tutorialPages.map((page, pageIndex) => {

            return new EmbedBuilder()
        
                .setColor('#9696ab')
        
                .setTitle(page.title)
        
                .addFields({ name: '\n', value: page.content }) // Ensure content is a string and within length limits

                .setFooter({ text: `Page ${pageIndex + 1} of ${tutorialPages.length}` })
        
                .setTimestamp();
        
        });
        
        
        // Create the buttons for navigation
        
        const row = new ActionRowBuilder()
        
            .addComponents(
        
                new ButtonBuilder()
        
                    .setCustomId('previous')
        
                    .setLabel('Previous')
        
                    .setStyle(ButtonStyle.Primary),
        
                new ButtonBuilder()
        
                    .setCustomId('next')
        
                    .setLabel('Next')
        
                    .setStyle(ButtonStyle.Primary)
        
            );
        
        
            
        
                let currentPage = 0;
        
                await message.channel.send({ embeds: [tutorialEmbeds[currentPage]], components: [row] });
        
        
        
                const filter = i => ['previous', 'next'].includes(i.customId) && i.user.id === user.id;
        
                const collector = message.channel.createMessageComponentCollector({ filter, time: 180000 });
        
        
                collector.on('collect', async (i) => {
        
                    if (i.customId === 'previous') {
        
                        currentPage = currentPage > 0 ? --currentPage : tutorialEmbeds.length - 1;
        
                    } else if (i.customId === 'next') {
        
                        currentPage = currentPage + 1 < tutorialEmbeds.length ? ++currentPage : 0;
        
                    }
        
                    await i.update({ embeds: [tutorialEmbeds[currentPage]], components: [row] });
        
                });
        
        
                collector.on('end', collected => {
                    collected.first().update({ components: [] });
                });        
            }
        
         

    },
info:{
    names: ['tutorial', 'tut', 'guide'],
}
    }