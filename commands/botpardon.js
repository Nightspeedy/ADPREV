const members = require('./../members.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.author.id == 365452203982323712) {

        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);
        if (message.mentions.members.first()) {
            args[0] = message.mentions.members.first().user.id;
        }
        if (!members[args[0]]) return message.channel.send("**Error!** User does not exist in my database!")

        if (members[args[0]].isBanned == true) {

            members[args[0]].isBanned = false;

            message.channel.send("User ID " + args[0] + " Has been pardoned. They can now use " + bot.user.username + " again.");

            fs.writeFile("./members.json", JSON.stringify(members), (err) => {
                if (err) console.log(err);
            });

        } else {
            message.channel.send("**Error!** User is not banned!");
        }
        
    } else {

        return message.channel.send("**Error!** You do not have permission to execute this command!");

    }

}

module.exports.help = {
    name: "bot-pardon",
    description: "BOT OWNER ONLY! Unbans a user from the bot.",
    args: "[@user/userID]",
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