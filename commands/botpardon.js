const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if(message.author.id != 365452203982323712) return message.channel.send("**Error!** Usage of this command is restricted!");

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
    if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

    if (message.mentions.members.first()) {
        args[0] = message.mentions.members.first().user.id;
    }

    await members.findOne({where: {id: args[0]}}).then( async(member) => {

        if (member.dataValues.isBanned == true) {

            let isBanned = false;
    
            members.update({isBanned: isBanned}, {where: {id: args[0]}});

            message.channel.send("User ID " + args[0] + " Has been pardoned. They can now use " + bot.user.username + " again.");
    
        } else {
            message.channel.send("**Error!** User is not banned!");
        }

    }).catch(() => {
        return message.channel.send("**Error!** User does not exist in my database!");
    });
}

module.exports.help = {
    name: "bot-pardon",
    description: "BOT OWNER ONLY! Unbans a user from the bot.",
    args: "[@user/userID]",
    modCommand: false,
    botOwner: true,
    utility: false,
    social: false,
    games: false,
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