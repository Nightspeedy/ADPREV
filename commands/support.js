const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    let embed = new Discord.RichEmbed()
    .setTitle(bot.user.username + " Support")
    .setColor(getRandomColor())
    .addField("Support server", "Join the support server for help -> ")
    .addField("Live chat", "Get support through live-chat, Simply say the bot's name and ask your question (example: Kokoku? How do i use your commands?)")
    .addField("Further support", "If you need help some other way, contact Asuna#1000");

    message.author.send(embed).catch(err => {

        if(err) console.log(err)
        message.channel.send("**Error!** Could not send message. Did you disable direct messaging?")

    });

}

module.exports.help = {
    name: "support",
    description: "Support",
    args: "This command has no arguments.",
    modCommand: false,
    botOwner: false,
    utility: true,
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function save(){
    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });
}