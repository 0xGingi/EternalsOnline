const EMOJICONFIG = require('../../config/emoji.json');
const STATS = require('../../modules/statsBot.js');
const { numStr } = require('../../functionNumber/functionNbr.js')
const { EmbedBuilder, Message, Events } = require('discord.js');
const { prefix } = require('../../App/config.json')
const { inlineCode } = require('@discordjs/builders');
const PLAYERDATA = require('../../modules/player.js');
const SQUADDATA = require('../../modules/squad.js')
const {client} = require('../../App/index.js');

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
            /**=== Account Stats ===*/
            let statss =  await STATS.findOne({ botID: 899 });
            if (!statss) return message.reply(`${inlineCode('❌')} Error...`);
            let numUsers = await PLAYERDATA.countDocuments({});
            let numGuilds = await SQUADDATA.countDocuments({});
          
            var statsEmbed = new EmbedBuilder()
                .setColor('#fc9803')
                .setTitle(`FlipMMO Stats`)
                .setDescription(`${EMOJICONFIG.helmet} **Number of players** : ${inlineCode(numUsers)}\n${EMOJICONFIG.scroll4} **Number of Guilds** : ${inlineCode(numGuilds)}\n${EMOJICONFIG.coinchest} **Coins in circulation** : ${inlineCode(numStr(statss.amoutCoin))} ${EMOJICONFIG.coin}\n${EMOJICONFIG.attack} **Items in circulation** : ${inlineCode(numStr(statss.amoutItem))}\n${EMOJICONFIG.attack6} **Total number of dead monsters** : ${inlineCode(numStr(statss.amoutMonsterKilled))}`)            
                .setTimestamp();
            
            message.channel.send({embeds: [statsEmbed]});
        }
    },
            
    info: {
        names: ['bot']
    }
}
