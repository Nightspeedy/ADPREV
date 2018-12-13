const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    if(message.author.id != 365452203982323712) return message.channel.send("**Error!** Usage of this command is restricted!");

    if (!args[0]) return message.reply("Error! Please use at least 1 argument!")
    
    if (args[0] == "true"){
        guildSettings[message.guild.id].isPremium = true;
        message.channel.send("This server is now using " + bot.user.username + " Premium.");
    } else if (args[0] == "false") {
        guildSettings[message.guild.id].isPremium = false;
        message.channel.send("This server is no longer using " + bot.user.username + " Premium.");
    }

    save();
}
module.exports.help = {
    name: "premium",
    description: "BOT OWNER ONLY! Sets the premium status of a server.",
    args: "[true/false]",
    modCommand: false,
    botOwner: true,
    utility: false,
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