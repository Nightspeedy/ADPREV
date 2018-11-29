const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    
    let embed = new Discord.RichEmbed()
    .setTitle(bot.user.username + " Command help")
    .setColor(getRandomColor());

    //console.log(bot.commands);
    let commands = bot.commands.keyArray();

    if (!args[0]) {

        for (i = 0; i < commands.length; i++) {

            let getObject = bot.commands.get(commands[i])
    
            if(commands[i] == "help") {
                
            } else {
                if (getObject.help.modCommand == true || getObject.help.botOwner == true) {

                } else {
                    embed.addField(guildSettings[message.guild.id].prefix + getObject.help.name, getObject.help.description);
                }
            }
        }
        embed.setFooter("Show moderator commands with " + guildSettings[message.guild.id].prefix + "help moderator");
        
        message.channel.send(embed)

    } else if (args[0] == "moderator") {

        console.log("y")

        for (i = 0; i < commands.length; i++) {

            let getObject = bot.commands.get(commands[i])
    
            if(commands[i] == "help") {
                
            } else {
                if (getObject.help.modCommand == false) {

                } else {
                    embed.addField(guildSettings[message.guild.id].prefix + getObject.help.name, getObject.help.description);
                }
            }
        }

        message.channel.send(embed);
    }else if (args[0] == "owner") {

        console.log("y")

        for (i = 0; i < commands.length; i++) {

            let getObject = bot.commands.get(commands[i])
    
            if(commands[i] == "help") {
                
            } else {
                if (getObject.help.botOwner == false) {

                } else {
                    embed.addField(guildSettings[message.guild.id].prefix + getObject.help.name, getObject.help.description);
                }
            }
        }

        message.channel.send(embed);
    } else {
        message.channel.send("**Error!** Unknown error!");
    }
}

module.exports.help = {
    name: "help",
    description: "The help command.",
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