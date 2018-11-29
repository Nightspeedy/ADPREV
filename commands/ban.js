const guildSettings = require('./../guildSettings.json');
const members = require('./../members.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.member.hasPermission("BAN_MEMBERS")) {

        // Check if caller is using the correct arguments
        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (!args[1]) return message.channel.send("**Error!** Please provide a reason for this ban!");
        if (args[0] != message.mentions.members.first()) return ("**Error!** I couldn't find this person!");
        
        let memberToBan = message.mentions.members.first();

        // Ban reason forloop
        var finalStr = "";
        for(i = 1; i < args.length; i++) {

            addString =  (args[i] + " ");
            
            finalStr += addString;
            console.log(finalStr);

        }
        // Try to ban the user
        try {

            memberToBan.ban(finalStr).then(member => {

                message.channel.send("Successfuly banned user!").then(message => message.delete(10000));

                if (guildSettings[message.guild.id].logChannel) {

                    // Check if the channel exists. If it doesnt, then return
                    if(!bot.channels.get(guildSettings[message.guild.id].logChannel)) return;

                    // Create the embed and send it
                    let embed = new Discord.RichEmbed()
                    .setTitle("Banned user")
                    .setColor(getRandomColor())
                    .addField("Member", member)
                    .addField("Reason", finalStr)

                    bot.channels.get(guildSettings[message.guild.id].logChannel).send(embed)

                }
            }).catch(err => {

                console.log(err)

            });
        // catch the error if one occurs
        } catch (error) {

            console.log(error);

        }
    // Run this if a user does not meet the required permissions
    } else {

        return message.channel.send("**Error!** You do not have permission to execute this command!");

    }
}

module.exports.help = {
    name: "ban",
    description: "Bans a user from the server",
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