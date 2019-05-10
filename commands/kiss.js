const gifs = require('./../socialGifs.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    let gif = Math.floor(Math.random() * gifs.kiss.length);

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())
    .setDescription(`image not loading? click [here](${gifs.kiss[gif]})`)

    if (!args) {
        
        embed.setTitle("You can't kiss yourself, silly :3")
        await embed.setImage(gifs.kiss[gif])

        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    } else if (args[0]) {

        if (args[0] != message.mentions.members.first()) return message.channel.send("Oh, looks like i couldn't find that person!");

        
        embed.setTitle(`${message.author.username} kissed ${message.mentions.members.first().user.username}! :blush:`)
        await embed.setImage(gifs.kiss[gif])
        message.channel.send(embed).catch(err => {if(err) console.log(err)});
    }
}
module.exports.help = {
    name: "kiss",
    description: "Kiss your loved one, or a friend :3",
    args: "[@mention]",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: true,
    games: false
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