const members = require('./../members.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');


module.exports.run = async(bot, message, args) => {

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
    if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

    let messageStr = "Top 10 ranking: ";

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())

    if (args[0] == "levels") {

        let a = Object.keys(members).sort((a,b)=>members[b].level - members[a].level);

        embed.setTitle("Top 10 ranking: Level");

        for (i = 0; i < a.length; i++) {


            if (i < 10) {
                const user = await bot.fetchUser(a[i]);

                embed.addField("#" +(i+1)+ " " + user.tag, "Level: " + members[a[i]].level);

            } else {
                
            }

        }
        message.channel.send(embed);

    } else if (args[0] == "credits"){

        let b = Object.keys(members).sort((a,b)=>members[b].credits - members[a].credits);

        embed.setTitle("Top 10 ranking: Credits");

        for (i = 0; i < b.length; i++) {


            if (i < 10) {
                const user = await bot.fetchUser(b[i]);

                embed.addField("#" +(i+1)+ " " + user.tag, "Credits: " + members[b[i]].credits);

            } else {
                
            }

        }
        message.channel.send(embed);

    } else if (args[0] == "reputation") {

        let c = Object.keys(members).sort((a,b)=>members[b].reputation - members[a].reputation);

        embed.setTitle("Top 10 ranking: Reputation");

        for (i = 0; i < c.length; i++) {


            if (i < 10) {
                const user = await bot.fetchUser(c[i]);

                embed.addField("#" +(i+1)+ " " + user.tag, "Reputation: " + members[c[i]].reputation);

            } else {
                
            }

        }
        message.channel.send(embed);

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
