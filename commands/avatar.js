const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if (!args[0]) {

        let embed = new Discord.RichEmbed()
        .setTitle(message.author.tag)
        .setColor(getRandomColor())
        .setDescription(`Here you go, |[Click me](${message.author.displayAvatarURL})|`)
        .setImage(message.author.displayAvatarURL)

        message.channel.send(embed);

    } else if (args[0]) {

        if (!message.mentions.members.first()) return message.channel.send("**Error!** Please mention a valid user!");
        // if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");

        let embed = new Discord.RichEmbed()
        .setTitle(message.mentions.members.first().user.tag)
        .setColor(getRandomColor())
        .setDescription(`Here you go, |[Click me](${message.mentions.members.first().user.displayAvatarURL})|`)
        .setImage(message.mentions.members.first().user.displayAvatarURL)

        message.channel.send(embed);

    } else {

        //do nothing

    }

}
module.exports.help = {
    name: "avatar",
    description: "Get your avater, or someone else's.",
    args: "[@user]",
    modCommand: false,
    botOwner: false,
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
function save(){
    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });
}