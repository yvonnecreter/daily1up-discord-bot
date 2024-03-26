const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const cname = "info"

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Displays your user settings'),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        fs.readFile('./data/userdata.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: 'Error reading user data!', ephemeral: true });
            }
            const userData = JSON.parse(data);
            const userInfo = userData[userId];

            if (!userInfo) {
                return interaction.reply({ content: 'You don\'t have any saved data yet.', ephemeral: true });
            }
            const embed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle(`✨ ${interaction.user.username}'s Daily Uplift Settings`)
                .addFields(
                    { name: '🌍 Timezone', value: userInfo.timezone || 'Not set' },
                    { name: '⏰ Reminder Times', value: userInfo.times?.join('\n') || 'None' },
                    { name: '💡 Uplift Type', value: userInfo.messageType?.join('\n') || 'None' },
                )
                .setFooter({ text: 'Spread positivity! 😊' });
            interaction.reply({ embeds: [embed] });
        });
    }
};