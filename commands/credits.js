const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, args, members) => {

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())

    if (!args[0]) {

        await members.findOne({where: {id: message.author.id}}).then( async(member) => {

            embed.setTitle(message.author.username+"'s Credits")
            .setDescription("You have " + member.dataValues.credits + " Credits!")
            
            return message.channel.send(embed);

        });
    } else if (args[0]) {

        if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
        if (!message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user!");

        await members.findOne({where: {id: message.mentions.members.first().user.id}}).then( async(member) => {

            embed.setTitle(message.mentions.members.first().user.username +"'s Credits")
            .setDescription("They have " + member.dataValues.credits + " Credits!")
    
            return message.channel.send(embed);

        });

    } else {
        return message.channel.send("**Error!** Unknown Error!");
    }

}
module.exports.help = {
    name: "credits",
    description: "Check your credit balance.",
    args: "{@user}",
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