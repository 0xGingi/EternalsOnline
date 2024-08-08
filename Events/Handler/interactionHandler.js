
const { ChatInputCommandInteraction, Events } = require('discord.js')
const {client} = require('../../App/index')

module.exports = {
    name: Events.InteractionCreate,
    execute(interaction) {
        if(!interaction.isChatInputCommand()) return

        const command = client.commands.get(interaction.commandName)
        if(!command) {
            client.application.commands.delete(command)
            return interaction.reply({content: 'This command is not working at the moment.', ephemeral: true})
        }

        command.execute(interaction, client)

    }
}

