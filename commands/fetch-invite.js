const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.author.id == 365452203982323712){

        if (!args[0]) return message.reply("**Error!** Please use at least 1 argument!");

        
        try {
            var fetchedGuild = bot.guilds.get(args[0]);

            message.delete();

            fetchedGuild.channels.filter(channel => channel.type == "text").random().createInvite({unique: true}).then(invite => message.channel.send(`Created invite line https://discord.gg/${invite.code}`).then(message => message.delete(10000)));


        } catch (error) {
            console.log(error);
            message.channel.send("**Error!** I could not create an invite for this server!");
        }


    } else {
        return message.channel.send("**Error!** You do not have permission to execute this command!");
    }


}

module.exports.help = {
    name: "fetch-invite"
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