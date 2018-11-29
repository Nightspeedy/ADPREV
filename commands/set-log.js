const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    if (message.member.hasPermission("ADMINISTRATOR")) {

        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);
        if (!message.mentions.channels.first()) return message.channel.send("**Error!** Expected argument is not a channel!");

        guildSettings[message.guild.id].logChannel = message.mentions.channels.first().id;

        message.channel.send("Logchannel set to: " + args[0]);

        save();

    } else {
        message.channel.send("**Error!** You do not have permission to execute this command!");
    }

}
module.exports.help = {
    name: "set-logchannel",
    description: "Sets the logging channel. (Only commands of this bot get logged at this moment)   ",
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