const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if (!args[0]) {

        await members.findOne({where: {id: message.author.id}}).then( async(member) => {

            let nxtLvl = member.dataValues.level * botconfig.level;

            const embed = new Discord.RichEmbed()
            .setTitle(message.author.username + "'s Profile")
            .setThumbnail(message.author.displayAvatarURL)
            .setColor(getRandomColor())
            .addField("Level", member.dataValues.level)
            .addField("Next level progress", member.dataValues.exp + "/" + nxtLvl + " Exp")
            .addField("Reputation", member.dataValues.reputation)
            .addField("Credits", member.dataValues.credits);
    
            message.channel.send(embed);

        });



    } else if (args[0]) {

        if (!message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user!");
        if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");

        await members.findOne({where: {id : message.mentions.members.first().user.id}}).then( async(member) => {

            let nxtLvl = member.dataValues.level * botconfig.level;

            const embed = new Discord.RichEmbed()
            .setTitle(message.mentions.members.first().user.username + "'s Profile")
            .setThumbnail(message.mentions.members.first().user.displayAvatarURL)
            .setColor(getRandomColor())
            .addField("Level", member.dataValues.level)
            .addField("Next level progress", member.dataValues.exp + "/" + nxtLvl + " Exp")
            .addField("Reputation", member.dataValues.reputation)
            .addField("Credits", member.dataValues.credits);
    
            message.channel.send(embed);

        });

    } else {

        // do nothing
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