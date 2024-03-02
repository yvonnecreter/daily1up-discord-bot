const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const cname = "help"

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('How do I start?'),
    async execute(interaction, client) {
        const instructionsEmbed = new EmbedBuilder()
            .setColor('#5865F2') // Official Discord Blurple color
            .setTitle('✨ Daily Uplift Setup')
            .setDescription('Get started with daily uplifts in just a few steps:')
            .addFields(
                { name: '🌎 Set Your Timezone', value: 'Use the `/settimezone` command to ensure reminders arrive at the right time.' },
                { name: '⏰ Add Message Times', value: 'Use the `/addtime` command to specify when you want to receive 1-ups.' },
                { name: '😊 Get an Uplift', value: 'Need a quick boost? Use `/senduplift` for an instant motivational message.' },
                { name: '🔕 Remove Notifications', value: 'Change your mind? Use `/removetime` to remove any scheduled 1-ups.' }
            )
            .setFooter({ text: 'You\'re all set!' });

        await interaction.reply({ embeds: [instructionsEmbed] });
    },
};