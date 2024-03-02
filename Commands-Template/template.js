const { SlashCommandBuilder } = require("discord.js");
const cname = "template"

module.exports = {
    data: new SlashCommandBuilder()
        .setName(cname)
        .setDescription('Check whether ' + cname + ' command works.'),
    async execute(interaction, client) {
        console.log("Command " + cname + " executed.");
        await interaction.reply("Template works.");
    },
};

/* 
INITIAL RESPONSES
await interaction.reply('Pong!');
await interaction.deferReply(); //display discord isthinking message
await interaction.deferReply({ ephemeral: true });
await wait(2_000);

ADDITIONAL RESPONSES
await interaction.editReply('Pong again!'); 
await interaction.followUp('Pong again!'); //for additional messages
await interaction.deleteReply();

ADDITIONAL REPLIES
const message = await interaction.fetchReply();

ATTRIBUTES
client.on(Events.InteractionCreate, interaction => {
    const locales = {
        pl: 'Witaj Świecie!',
        de: 'Hallo Welt!',
    };
    interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});


*/