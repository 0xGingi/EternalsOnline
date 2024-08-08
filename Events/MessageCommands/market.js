const Marketplace = require('../../modules/marketplace.js');
const EMOJICONFIG = require('../../config/emoji.json');
const Discord = require('discord.js');
const { prefix } = require('../../App/config.json')
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Events, ButtonStyle, ComponentType } = require('discord.js');
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
 
            // Retrieve all the marketplace listings
    let response = '\n';
    let listings = await Marketplace.find({});

    if (args.length > 0) {
        const equipAlias = args[0].toLowerCase();
        const categories = ["item", "food", "fish", "ore", "bars", "logs"];
        if (categories.includes(equipAlias)) {
            listings = listings.filter(listing => listing.type.toLowerCase() === equipAlias);
        } else {
            listings = listings.filter(listing => listing.itemEa.toLowerCase() === equipAlias);
        }
    }    

    if (listings.length === 0) {
        return message.channel.send('No listings found for the provided alias.');
    }    


    let fields = [];
    let pages = [];

    listings.forEach((listing, i) => {
        let price = listing.price;
        fields.push(
            { name: `${EMOJICONFIG.coinchest} ${listing.itemName} (${listing.itemEa})`, value: `Amount: ${listing.amount}\nPrice: ${EMOJICONFIG.coin} ${price}\nSeller: ${listing.sellerName}`, inline: true }
        );

        if (fields.length === 12 || i === listings.length - 1) {
            pages.push(fields);
            fields = [];
        }
    });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Previous Page'),
            new ButtonBuilder()
                .setCustomId('next')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Next Page')
        );

    let currentPage = 0;

    
        const itemEmbed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle(`${EMOJICONFIG.coinchest} Grand Exchange`)
            .addFields(pages[currentPage])
            .setTimestamp();


            const msg = await message.channel.send({ embeds: [itemEmbed], components: [row] });

            const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

            collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) return;
            if (interaction.customId === 'previous') {
                if (currentPage !== 0) currentPage--;
            } else if (interaction.customId === 'next') {
                if (currentPage < pages.length - 1) currentPage++;
            }
            const newEmbed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle(`${EMOJICONFIG.coinchest} Grand Exchange`)
            .addFields(pages[currentPage])
            .setTimestamp();

        await interaction.update({ embeds: [newEmbed] });
    });

    collector.on('end', () => {
        msg.edit({ components: [] });
    });          

};    
},
info: {
    names: ['market', 'listing', 'listings', 'ge', 'grandexchange'],
} }