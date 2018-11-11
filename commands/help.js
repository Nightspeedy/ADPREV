const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())
    .setTitle("ADPREV Command Help")
    .addField("What is ADPREV?", "ADPREV is a bot developed by Asuna#1000. ADPREV is a configurable bot that bans/kicks any user that has a link in their username to advertise their social platforms, and deletes any welcoming messages.")
    .addBlankField(true)
    .addField("User with a link not kicked/banned and no message was deleted?", "Please contact Asuna#1000 and send her the link this user had in their username, the domain is probbably not registered within ADPREV's database yet.")
    .addBlankField(true)
    .addField(guildSettings[message.guild.id].prefix + "set-prefix [prefix]", "Set the command prefix.")
    .addField(guildSettings[message.guild.id].prefix + "set-channel [channel]", "Set your join/leave message channel.")
    .addField(guildSettings[message.guild.id].prefix + "set-ban [true/false]", "Toggle banning on or off.")
    .addField(guildSettings[message.guild.id].prefix + "set-message [true/false]", "Toggle action messages on or off.")
    .addField(guildSettings[message.guild.id].prefix + "settings", "See all your current settings.")
    .addField(guildSettings[message.guild.id].prefix + "invite", "Get the bot invite link to add it to your own server.")
    .addBlankField(true)
    .addField("Support", "For additional help, contact Asuna#1000");

    message.channel.send(embed)
}

module.exports.help = {
    name: "help"
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