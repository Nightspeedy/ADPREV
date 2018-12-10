const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    let settings = new Discord.RichEmbed()
    .setColor(getRandomColor())
    .setTitle("Settings")
    .addBlankField(true)
    .addField("Command prefix", guildSettings[message.guild.id].prefix)
    .addField("Join/leave channel", guildSettings[message.guild.id].channel)
    .addField("Ban offenders", guildSettings[message.guild.id].ban)
    .addField("Action messages", guildSettings[message.guild.id].actionMessage)

    message.channel.send(settings).then(message);

}

module.exports.help = {
    name: "settings",
    description: "This command will be removed soon.",
    args: "This command will be removed soon.",
    modCommand: false,
    botOwner: false
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