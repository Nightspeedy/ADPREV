const members = require('./members.json');
const fs = require('fs');
const botconfig = require('./botconfig.json');
const Discord = require('discord.js');

module.exports.run = async(bot, message) => {


    // If message includes "", send DM.
    if (messageLow.includes("kokoku") || messageLow.includes("nashi")|| messageLow.includes("kōkoku") && message.channel.type != "dm") {

        if (members[message.author.id].isBanned) {
            return message.channel.send("**Error!** You are banned from using this bot!");
        } else {

            if (botconfig.server == message.guild.id && botconfig.forwardMessages == true) return;

            let embed = new Discord.RichEmbed()
            .setTitle("#"+message.channel.name)
            .addField(message.author.tag, message.content)
            .setColor(getRandomColor())
            .setAuthor(message.guild.name)
            .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)

            bot.fetchUser("365452203982323712").then(user => user.send(embed));
        
        }
    }

    // Forward messages to Asuna#1000.
    if (botconfig.forwardMessages == true && message.author.id != 503687810885353472 && message.guild.id == botconfig.server) {

        if (!message.content) return;

        let embed = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle(message.guild.name)
        .setDescription(message.content)
        .addField("#"+message.channel.name, message.author.tag)
        .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)

        bot.fetchUser("365452203982323712").then(user => user.send(embed));
    }

// Commands below ||
//                
//      ____________
//     |            |
//     |            |
//     |            |
//     |            |
//     |            |
//     |            |
//     |            | 
//  ___|            |___
//  \                  /
//   \                /
//    \              /
//     \            /
//      \          /
//       \        /
//        \      /
//         \    /
//          \  /
//           \/


}
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}