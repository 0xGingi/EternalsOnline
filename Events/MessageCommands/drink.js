const PLAYER = require('../../modules/player.js');
const POTIONS = require('../../config/potions.json');
const { prefix } = require('../../App/config.json');
const levelConfig = require('../../config/configLevel.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const { bold, inlineCode, codeBlock } = require('@discordjs/builders');
const {client} = require('../../App/index.js');

module.exports = {

    name: Events.MessageCreate,

    /**

     * @param {Message} message

     */

    async execute(message) {
        var user = message.author;
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
    
        const foodName = args[0].toLowerCase();

        if (!foodName) {
            message.reply("Please specify a potion to drink");
            return;

        }

        let player = await PLAYER.findOne({ userId: user.id }).exec();
            if (!player) {
                message.reply(`You are not a player yet ${inlineCode(`@Eternals start`)}`);
                return;
            }

            if (player.player.potion.name !== "") {
                message.reply(`You have drunk a ${player.player.potion.name} and cannot drink another potion`);
                return;
            }

            const foodConfig = POTIONS.find(f => f.name.toLowerCase() === foodName || (f.eatalias && f.eatalias.toLowerCase() === foodName));

            if (!foodConfig) {
                message.reply(`The Potion ${args[0]} does not exist ${inlineCode(`@Eternals list potions`)}`);
                return;
            }
            

            const foodInInventory = player.player.stuff.potions.find(f => 
                f.name.toLowerCase() === foodConfig.name.toLowerCase()
            );
            
            if (!foodInInventory || foodInInventory.amount < 1) { 
                message.reply(`You do not have a ${foodConfig.name} to drink`); 
                return; 
            }
            
            const attack = foodConfig.stats.attack;
            const defense = foodConfig.stats.defense;
            const dodge = foodConfig.stats.dodge;
            const crit = foodConfig.stats.crit;
            const id = foodConfig.id;
            const name = foodConfig.name;
            const desc = foodConfig.eatdescription;

            player.player.potion = {
                id: id,
                name: name,
                attack: attack,
                defense: defense,
                dodge: dodge,
                crit: crit
            }
            
            foodInInventory.amount -= 1;

            await player.save();
            
            stats = Object.entries(foodConfig.stats)
            .filter(([key, value]) => value !== 0)
            .map(([key, value]) => `+${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`)
            .join(' & ');
        
        let statsLine = stats ? `You will have ${stats} in your next dungeon attempt` : '';
        
        message.reply(`${desc}\n${statsLine}\nYou have ${foodInInventory.amount} ${name} left`);
    }
    },

    info: {
        names: ['drink'],
    }
}