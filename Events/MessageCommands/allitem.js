const { Collection, Events, EmbedBuilder, Message} = require('discord.js');
const CONFIG = require('../../config/stuff.json')
const { inlineCode } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const EMOJICONFIG = require('../../config/emoji.json');
module.exports = {
  	name: Events.MessageCreate,
	/**
     * @param {Message} message
     */
    async execute(message, args, commandName) {
		if (message.content.toLowerCase() && this.info.names.some(name => commandName === name)) {

			const category = args[0]; 
			const categories = CONFIG.map(item => item.categorie);

			if (!categories.includes(category)) return message.reply(`Invalid category. Please choose from 'weapon', 'magic-item', or 'armor'.`);
		
			const filteredItems = CONFIG.filter(item => item.categorie === category);
		  	var allITemEmbed = `` 
		  	
			for(const item of filteredItems) {
		
				allITemEmbed += `**${inlineCode(item.name)}** ${inlineCode("Alias: " + item.equipalias)}\n`
		
			}  
		
			var itemEmbed = new EmbedBuilder()
				.setColor('#02c201')
				.setTitle(`📦 All Items`)
				.setDescription(`${allITemEmbed}`)
				.setTimestamp();
			
			message.reply({embeds: [itemEmbed], ephemeral: true });
		
		}
	},

	info: {
		names: ['allitem', 'fullitem', 'aitem', 'items']
	}
}