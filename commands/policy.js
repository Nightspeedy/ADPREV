const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    
    let embed = new Discord.RichEmbed()
    .setTitle("TOS and Privacy")
    .setColor(getRandomColor())
    .setDescription("By interacting with the service (the bot) in any way, you agree to be bound by these terms.")
    .addField("Terms of Service", "http://branco.roversplace.org/Kokoku-nashi-TermsOfService.pdf")
    .addField("Privacy Policy", "http://branco.roversplace.org/Kokoku-nashi-privacypolicy.pdf")

    message.channel.send(embed)

}
module.exports.help = {
    name: "policy",
    description: "the bot's Terms of Service, and privacy policy.",
    args: "This command has no arguments",
    modCommand: false,
    botOwner: false,
    utility: true,
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