const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    
    let embed = new Discord.RichEmbed()
    .setTitle(bot.user.username + " Command help")
    .setColor(getRandomColor());

    //console.log(bot.commands);
    let commands = bot.commands.keyArray();

    for (i = 0; i < commands.length; i++) {

        let getObject = bot.commands.get(commands[i])

        if(commands[i] == "help") {
            
        } else {
            embed.addField(getObject.help.name, getObject.help.description);
        }
    }
    
    message.channel.send(embed)
}

module.exports.help = {
    name: "help",
    description: "The help command."
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