const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const fs = require("fs");
const moment = require('moment-timezone');
const cname = "removetime"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removetime')
        .setDescription('Remove a Daily 1-Up'),
    async execute(interaction, client) {
        const userId = interaction.user.id;

        fs.readFile('./data/userdata.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply('- <@' + userId + '>' + 'Error reading user data!');
            }
            const userData = JSON.parse(data);

            if (!userData[userId] || !userData[userId].times || userData[userId].times.length === 0) {
                return interaction.reply('<@' + userId + '> ' + 'You have no saved times.');
            } else {
                // Create Select Menu
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('removeTimeSelect')
                    .setPlaceholder('Select a time to remove');

                userData[userId].times.forEach(time => {
                    selectMenu.addOptions({
                        label: time,
                        value: time
                    });
                });

                const row = new ActionRowBuilder().addComponents(selectMenu);
                interaction.reply({ content: '<@' + userId + '> ' + 'Select the time to remove:', components: [row], ephemeral: true });

                // Interaction Handler
                client.on('interactionCreate', async interaction => {
                    if (!interaction.isStringSelectMenu()) return;

                    if (interaction.user.id != userId) {
                        // await
                        interaction.reply({
                            content: `<@${interaction.user.id}> This message was not meant for you!`
                        });
                        return;
                    }

                    if (interaction.customId === 'removeTimeSelect') {
                        const selectedTime = interaction.values[0];

                        // Remove the time
                        userData[userId].times = userData[userId].times.filter(time => time !== selectedTime);

                        // Save updated data
                        fs.writeFile('./data/userdata.json', JSON.stringify(userData), (err) => {
                            if (err) {
                                console.error(err);
                                return interaction.reply('<@' + userId + '> ' + 'Error saving time data!');
                            }
                            interaction.reply('<@' + userId + '> ' + 'Time removed!');
                        });
                    }
                });
            }
        });
    }
};
