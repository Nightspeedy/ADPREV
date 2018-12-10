const members = require('./../members.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
    if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

    let messageStr = "Top 25 ranking: ";

    if (args[0] == "levels") {

        let c = Object.keys(members).sort((a,b)=>members[a].level - members[b].level);

        messageStr += "Levels";

        for (i = 0; i < 25; i++){
            
        }

    } else if (args[0] == "credits"){

        let b = Object.keys(members).sort((a,b)=>members[a].credits - members[b].credits);

    } else if (args[0] == "reputation") {

        let c = Object.keys(members).sort((a,b)=>members[a].reputation - members[b].reputation);

    } else {
        return message.channel.send("**Error!** Invalid argument!");
    }

}
module.exports.help = {
    name: "top",
    description: "Check the leaderboard, see if you're on it!",
    args: "[levels/credits/reputation]",
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