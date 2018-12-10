const members = require('./../members.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    // Check if the caller is me, if it's not, return
    if (message.author.id == 365452203982323712) {

        // Make sure i use the correct arguments
        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);
        
        if (message.mentions.members.first()) {
            args[0] = message.mentions.members.first().user.id;
        }

        if (args[0] == message.author.id) return message.channel.send("**Error!** You cannot ban yourself!");
        if (!members[args[0]]) return message.channel.send("**Error!** User does not exist in my database!");

        // Check if a user is already banned, return if they are.
        if (members[args[0]].isBanned == false) {

            members[args[0]].isBanned = true;

            message.channel.send("User ID " + args[0] + " Has been banned from using " + bot.user.username );

            fs.writeFile("./members.json", JSON.stringify(members), (err) => {
                if (err) console.log(err);
            })

        } else {

            message.channel.send("**Error!** User is already banned!");

        }
        
    } else {

        return message.channel.send("**Error!** You do not have permission to execute this command!");

    }

}

module.exports.help = {
    name: "bot-ban",
    description: "BOT OWNER ONLY! Bans a user from the bot.",
    args: "[@user/userID]",
    modCommand: false,
    botOwner: true,
    utillity: false,
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