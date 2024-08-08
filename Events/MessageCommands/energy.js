const PLAYER = require('../../modules/player.js');
const { Captcha } = require("discord.js-captcha");
const { prefix } = require('../../App/config.json');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
const EMOJICONFIG = require('../../config/emoji.json');
const {client} = require('../../App/index.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.mentions.users.first() !== client.user) return;
        const args = message.content.split(/ +/).slice(1);
        const commandName = args.shift().toLowerCase();
        if (this.info.names.some(name => commandName === name)) {
    
        const user = message.author;

            let player = await PLAYER.findOne({ userId: user.id }).exec();
            if (!player) {
                message.reply("You are not a player yet.");
                return;
            }
            const maxEnergy = 100 + (player.player.agility.level - 1);
            if (player.player.energy >= maxEnergy) {
                message.reply(`Your energy is already at ${maxEnergy}!`);
                return;
            }

            const channelId = message.channel.id;

            const captcha = new Captcha(message.client, {
                channelID: channelId,
                addRoleOnSuccess: false,
                sendToTextChannel: false,
                caseSensitive: false,
                attempts: 3,
                timeout: 30000,
                customPromptEmbed: new EmbedBuilder()
                    .setTitle("CAPTCHA")
                    .setDescription(`${player.pseudo} Please type the following CAPTCHA to restore your energy!`),
                customSuccessEmbed: new EmbedBuilder()
                    .setTitle("CAPTCHA")
                    .setDescription(`${player.pseudo} You have successfully restored your energy to ${maxEnergy}!`),
                customFailureEmbed: new EmbedBuilder()
                    .setTitle("CAPTCHA")
                    .setDescription(`${player.pseudo} You have failed to restore your energy!`),
            });
             captcha.present(message.member)
             captcha.on("success", data => {
                player.player.energy = maxEnergy;
                player.save();
            });
        }
    },
    info: {
        names: ['energy'],
    }
};