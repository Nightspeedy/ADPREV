const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    
    let embed = new Discord.RichEmbed()
    .setTitle(bot.user.username + " Command help")
    .setColor(getRandomColor());

    //console.log(bot.commands);
    let commands = bot.commands.keyArray();

    let gen = "";
    let util = "";
    let mods = "";

    if (!args[0]) {

        for (i = 0; i < commands.length; i++) {

            let getCommand = bot.commands.get(commands[i])
    
            if (getCommand.help.modCommand == true) {

                mods += " `" + getCommand.help.name + "` ";

            } else if( getCommand.help.utility == true) {

                util += " `" + getCommand.help.name + "` ";                

            } else if (getCommand.help.botOwner == true) {

            } else {
                
                gen += " `" + getCommand.help.name + "` ";                

            }
        }
        for (i = 0; i < commands.length; i++) {

            let getCommand = bot.commands.get(commands[i])

            if (getCommand.help.botOwner == true) {
                commands.splice(i, 1)
            }
        }

        embed.setDescription("Use " + guildSettings[message.guild.id].prefix +"help [command] for detailed command information.")
        embed.addField("General commands", gen);
        embed.addField("Utility commands", util);
        embed.addField("Mod commands", mods);
        embed.setFooter("Total commands: " + commands.length)
        
        message.channel.send(embed)

    } else {

        let commandFile = bot.commands.get(args[0]);
        if (!commandFile) return message.channel.send("**Error!** Could not find command!");

        let detailedEmbed = new Discord.RichEmbed()
        .setTitle("Command help: " + args[0])
        .setColor(getRandomColor())
        .setDescription("Arguments enclosed in curly braces ( {} ) are OPTIONAL!\nArguments enclosed in square brackets ( [] ) are REQUIRED! \n\n" + commandFile.help.description)
        .addField("Usage", guildSettings[message.guild.id].prefix + args[0] + " " + commandFile.help.args)

        message.channel.send(detailedEmbed);
    }
}

module.exports.help = {
    name: "help",
    description: "The help command.",
    args: "{Command}",
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