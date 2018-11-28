const members = require('./../members.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.member.hasPermission("BAN_MEMBERS")) {

        let reason = args.shift(args[0])

        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (!args[1]) return message.channel.send("**Error!** Please provide a reason for this ban!");
        if (args[0] == message.mentions.members.first()) {

            memberToBan = args[0];

            if (memberToBan.user.id == message.author.id) return message.channel.send("**Error!** You cannot ban yourself!");
            
            memberToBan.ban(reason);

        }
        

    } else {

        return message.channel.send("**Error!** You do not have permission to execute this command!");

    }
}

module.exports.help = {
    name: "ban",
    description: "Bans a user from the server"
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