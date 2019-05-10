const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
    if (isNaN(args[0])) return message.channel.send("**Error! Expected argument is not a number!");
    if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

    
}

module.exports.help = {
    name: "dice",
    description: "Roll a dice, can be usefull for roleplayers.",
    args: "[Amount]",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: false,
    games: true,
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
    fs.writeFile("./../members.json", JSON.stringify(members), (err) => {
        if (err) console.log(err);
    });
}