const members = require('./../members.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (!args[0]) {

        let nxtLvl = members[message.author.id].level * botconfig.level;

        const embed = new Discord.RichEmbed()
        .setTitle(message.author.username + "'s Profile")
        .setColor(getRandomColor())
        .addField("Level", members[message.author.id].level)
        .addField("Next level progress", members[message.author.id].exp + "/" + nxtLvl + " Exp")
        .addField("Reputation", members[message.author.id].reputation)
        .addField("Credits", members[message.author.id].credits);

        message.channel.send(embed);

    } else if (args[0]) {

        if (!message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user!");
        if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");

        let nxtLvl = members[message.mentions.members.first().user.id].level * botconfig.level;

        const embed = new Discord.RichEmbed()
        .setTitle(message.mentions.members.first().user.username + "'s Profile")
        .setColor(getRandomColor())
        .addField("Level", members[message.mentions.members.first().user.id].level)
        .addField("Next level progress", members[message.mentions.members.first().user.id].exp + "/" + nxtLvl + " Exp")
        .addField("Reputation", members[message.mentions.members.first().user.id].reputation)
        .addField("Credits", members[message.mentions.members.first().user.id].credits);

        message.channel.send(embed);

    } else {

        if (!members[args[0]]) return message.channel.send("**Error!** I could not find this user!");

        bot.fetchUser(args[0]).then(user => {

            if (user.bot) return message.channel.send("**Error!** Bot's do not have a profile!");

            let nxtLvl = members[user.id].level * botconfig.level;

            const embed = new Discord.RichEmbed()
            .setTitle(user.username + "'s Profile")
            .setColor(getRandomColor())
            .addField("Level", members[user.id].level)
            .addField("Next level progress", members[user.id].exp + "/" + nxtLvl)
            .addField("Reputation", members[user.id].reputation)
            .addField("Credits", members[user.id].credits);

            message.channel.send(embed);

        }).catch(err => {

            if(err) console.log(err);

        });

    }

}
module.exports.help = {
    name: "profile",
    description: "Show your, or someone else's profile.",
    args: "{@user/userID}",
    modCommand: false,
    botOwner: false,
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
function save(){
    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });
}