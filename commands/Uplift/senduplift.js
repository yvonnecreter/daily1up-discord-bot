const { SlashCommandBuilder } = require("discord.js");
const cname = "senduplift"
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Receive an Uplift'),
    async execute(interaction, client) {
        const userData = JSON.parse(fs.readFileSync('./data/userdata.json'))
        const userId = interaction.user.id
        const messageTypes = userData[userId].messageType
        const messageFiles = {
            'Inspirational Quotes': './data/inspirational.json',
            'Thoughtful Texts': './data/thoughtful.json',
            'Positive Affirmations': './data/affirmations.json',
            'Challenges': './data/challenges.json'
        };

        try {
            if (!messageTypes) {
                const messages = JSON.parse(fs.readFileSync(messageFiles['Inspirational Quotes']));
                const randomIndex = Math.floor(Math.random() * messages.length);
                await interaction.user.send(messages[randomIndex]);
            } else {
                for (const messageType of messageTypes) {
                    const messages = JSON.parse(fs.readFileSync(messageFiles[messageType]));
                    const randomIndex = Math.floor(Math.random() * messages.length);
                    await interaction.user.send(messages[randomIndex]);
                }
            }
            await interaction.reply({ content: 'Check your DMs! 😊', ephemeral: true });
        } catch (error) {
            console.error('Error sending DM:', error);
            await interaction.reply({ content: 'Oops, I couldn\'t send you a DM. Please check your privacy settings.', ephemeral: true });
        }
    },
};