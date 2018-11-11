const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    if (message.member.hasPermission("ADMINISTRATOR")) {
    
        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

        if (args[0] == "true") {

            guildSettings[message.guild.id].ban = true;
            message.channel.send("Now banning join/leave advertisements!");

            save();

        } else if (args[0] == "false") {

            guildSettings[message.guild.id].ban = false;
            message.channel.send("Now kicking join/leave advertisements!");

            save();

        } else {
            message.channel.send("**Error!** Expected argument 'true' or 'false' but got: " + args[0]);
        }

    } else {
        message.channel.send("You do not have permission to execute this command!");            
    }

}
module.exports.help = {
    name: "set-ban"
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