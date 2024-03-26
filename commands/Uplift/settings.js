const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const cname = "settings"
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Change your message settings.'),
    async execute(interaction, client) {
        const userId = interaction.user.id;
        let userData = []
        userData = await fetchUserData(userId);
        const messageTypes = ['Inspirational Quotes', 'Thoughtful Texts', 'Positive Affirmations', 'Challenges'];

        const row = new ActionRowBuilder();
        messageTypes.forEach(type => {
            const isActive = userData?.includes(type) ?? false; // Check if type is active
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`toggle_${type}`) // Unique ID for each button
                    .setLabel(type)
                    .setStyle(isActive ? ButtonStyle.Success : ButtonStyle.Secondary) // Green/Grey color
            );
        });

        if (!interaction.channel) {
            interaction.reply("This command has to be used in a server, you can try it in ours! ☀️ https://discord.gg/tc5qHRmBYE")
        } else {
            try {
                interaction.reply({
                    content: 'Select message types to activate/deactivate:',
                    components: [row],
                    ephemeral: true
                });
                const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });
                collector.on('collect', async (buttonInteraction) => {
                    let userData = await fetchUserData(userId);
                    let added = false;
                    const type = buttonInteraction.customId.split('_')[1]; // Extract the message type from the I
                    if (!userData.includes(type)) {
                        userData.push(type);
                        added = true;
                    }
                    else {
                        userData = userData.filter(function (v) {
                            return v !== type;
                        });
                    }
                    await saveUserData(userId, userData);


                    // Update button colors
                    row.components.forEach(button => {
                        const messageType = button.data.custom_id.split('_')[1];
                        const isActive = userData.includes(messageType) ?? false;
                        button.setStyle(isActive ? ButtonStyle.Success : ButtonStyle.Secondary);
                    });
                    await interaction.editReply({
                        content: 'Select message types to activate/deactivate:',
                        components: [row]
                    });

                    // Final Response
                    await buttonInteraction.reply({
                        content: `<@${interaction.user.id}> You successfully ${added ? 'activated' : 'deactivated'} ${type}`,
                        ephemeral: true
                    });
                });

                // Button timeout
                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        try {
                            await interaction.deleteReply();
                        } catch (error) {
                            console.error('Error deleting reply:', error);
                        }
                    }
                });
            } catch (error) {
                interaction.reply("An error occured. Please try again later or contact staff.");
                console.error('Error sending settings message: ', error);
            }
        }
    },
};

async function fetchUserData(userId) {
    const data = await fs.promises.readFile('./data/userdata.json');
    const userData = JSON.parse(data)[userId].messageType;
    return userData || [];
}

async function saveUserData(userId, userData) {
    try {
        const data = await fs.promises.readFile('./data/userdata.json');
        let dataToSave = JSON.parse(data);
        // console.log("dataToSave: " + JSON.stringify(dataToSave) + " | userId: " + userId + " | userData: " + userData);

        //Set New File
        if (!dataToSave[userId]) dataToSave[userId] = { "messageType": userData };
        else if (!dataToSave[userId].messageType) dataToSave[userId]['messageType'] = userData;
        else dataToSave[userId].messageType = userData;

        //Replace File
        await fs.promises.writeFile('./data/userdata.json', JSON.stringify(dataToSave));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}