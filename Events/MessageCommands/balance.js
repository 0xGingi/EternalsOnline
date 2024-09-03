const { Collection, Events, EmbedBuilder} = require('discord.js');
const BALANCEDATA = require('../../modules/economie.js');
const EMOJICONFIG = require('../../config/emoji.json');
const { numStr } = require('../../functionNumber/functionNbr.js');
const { inlineCode } = require('@discordjs/builders');
const { prefix } = require('../../App/config.json')
const {client} = require('../../App/index.js');

// Config Cooldown :
const shuffleTime = 3000;
var cooldownPlayers = new Collection();


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

  			/**=== Account Economie ===*/
  			let balance = await BALANCEDATA.findOne({ userId: message.author.id });
  			if (!balance) return message.reply(`${EMOJICONFIG.no} you are not player ! : ${inlineCode('@Eternals start')}`);

     		var balanceEmbed = new EmbedBuilder()
				.setColor('#d1d72c')
				.setTitle(`🏦 ${user.username}'s Balance`)
				.addFields(
					{ name: `**${EMOJICONFIG.coinchest} Balance Account :**\n`, value: `${EMOJICONFIG.coin} **Coin** : ${inlineCode(numStr(balance.eco.coins))}\n${EMOJICONFIG.xp} **Xp** : ${inlineCode(numStr(balance.eco.xp))}`, inline: true },
				)
				.setTimestamp();

			message.channel.send({embeds: [balanceEmbed]});

		}
    },
            
    info: {
		names: ['balance', 'coins', 'money', 'coin' ,'xp', 'exp', 'bal', 'wal', 'wallet']
    }
}