const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.member.hasPermission("MANAGE_MESSAGES")) {

        // Check for correct arguments
        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

        // Check if user input is a number
        if (isNaN(args[0])) return message.channel.send("**Error!** Expected argument is not a number!");
        if (args[0] > 100) args[0] = 100;
        let user = message.author;
        message.delete();
        var int = parseInt(args[0]);
        int = int;

        await message.channel.fetchMessages({limit: int}).then(messages => {

            message.channel.bulkDelete(messages);

            message.channel.send(`Deleted ${int} Messages`)

        }).catch(err => {if (err) console.log(err)});
        
    } else {
        return message.channel.send("**Error!** You do not have permission to execute this command!");
    }

}
module.exports.help = {
    name: "purge",
    description: "Purge an X amount of messages.",
    args: "[Amount(1 to 100)]",
    modCommand: true,
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