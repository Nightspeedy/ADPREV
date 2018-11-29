const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (message.member.hasPermission("MANAGE_MESSAGES")) {

        if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
        if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);
        if (isNaN(args[0])) return message.channel.send("**Error!** Expected argument is not a number!");
        if (args[0] > 5000) return message.channel.send("**Error!** I can't purge more then 5000 messages at once!")
        let user = message.author;
        message.delete();
        message.channel.bulkDelete(args[0]).then(message.channel.send("Deleted: " + args[0] + " messages!").then(message => {

            message.delete(10000)

            if (guildSettings[message.guild.id].logChannel) {

                if(!bot.channels.get(guildSettings[message.guild.id].logChannel)) return;

                let embed = new Discord.RichEmbed()
                .setTitle("Message purge")
                .setColor(getRandomColor())
                .addField("Purged by", user.tag)
                .addField("Purged in", message.channel.name)
                .addField("Amount purged", args[0] + " Messages");

                bot.channels.get(guildSettings[message.guild.id].logChannel).send(embed)

            }

        }))
        
    } else {
        return message.channel.send("**Error!** You do not have permission to execute this command!");
    }

}
module.exports.help = {
    name: "purge",
    description: "Purge an X amount of messages.",
    modCommand: true,
    botOwner: false
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