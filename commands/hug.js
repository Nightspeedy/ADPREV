const gifs = require('./../socialGifs.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    let gif = Math.floor(Math.random() * gifs.hug.length);

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())
    .setDescription(`image not loading? click [here](${gifs.hug[gif]})`);

    if (!args) {
        
        embed.setTitle("Ahw... have a hug :3")
        await embed.setImage(gifs.hug[gif])

        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    } else if (args[0]) {

        if (args[0] != message.mentions.members.first()) return message.channel.send("Oh, looks like i couldn't find that person!");

        
        embed.setTitle(`${message.author.username} hugged ${message.mentions.members.first().user.username}!`)
        await embed.setImage(gifs.hug[gif])
        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    }
}
module.exports.help = {
    name: "hug",
    description: "Go on! hug your friends!",
    args: "[@mention]",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: true,
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