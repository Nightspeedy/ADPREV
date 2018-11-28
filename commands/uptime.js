const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    // const uptime = bot.uptime;
    // let days = Math.floor(uptime / 60 / 60 / 24) 
    // let hours = Math.floor(uptime / 60 / 60 % 24)
    // let minutes = Math.floor(uptime / 60 % 60);
    // let seconds = Math.floor(uptime % 60);

    let totalSeconds = (bot.uptime / 1000);
    totalSeconds %= 3600;
    let hours = Math.floor(totalSeconds / 3600); 
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())
    .addField("Uptime", /*days + " Days, " */ + hours + " Hours, " + minutes + " Minutes, " + seconds.toFixed(0) + " Seconds.");
    
    message.channel.send(embed);


    message.channel.send("This feature is being worked on! Uptime might not be accurate! Please stand by.");

}

module.exports.help = {
    name: "uptime"
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