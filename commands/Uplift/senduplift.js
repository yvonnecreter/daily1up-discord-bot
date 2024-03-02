const { SlashCommandBuilder } = require("discord.js");
const cname = "senduplift"
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Receive an Uplift'),
    async execute(interaction, client) {
        const oneups = JSON.parse(fs.readFileSync('./data/1up.json'));

        try {
            const user = interaction.user;
            await user.send(oneups[Math.floor(Math.random() * oneups.length)]);
            await interaction.reply({ content: 'Check your DMs! 😊', ephemeral: true });

        } catch (error) {
            console.error('Error sending DM:', error);
            await interaction.reply({ content: 'Oops, I couldn\'t send you a DM. Please check your privacy settings.', ephemeral: true });
        }
    },
};