const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (guildSettings[message.guild.id].isPremium == true) {

            guildSettings[message.guild.id].banMessage = message.content.slice(prefix.length + command.length + 1);
            message.channel.send("Banmessage set to '" + guildSettings[message.guild.id].banMessage + "'");

        } else {
            message.channel.send("**Error!** You do not have ADPREV-Premium!");
        }

    } else {
        message.channel.send("**Error!** You do not have permission to execute this command!");            
    }

}

module.exports.help = {
    name: "set-message",
    description: "This command will be removed soon.",
    modCommand: true,
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