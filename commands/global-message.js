const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    const prefix = guildSettings[message.guild.id].prefix;
	const args1 = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args1.shift();

    if (message.author.id == 365452203982323712) {

        let messageToSend = message.content.slice(command.length + prefix.length +1);
        let servers = Object.keys(guildSettings);

        console.log(command);
        for (o = 0; o < servers.length; o++){

            let curServer = bot.guilds.get(servers[o]);
            //let curChannel = bot.curServer.channels.find('name', guildSettings[servers[o]].channel);

            console.log(o);

            if (guildSettings[servers[o]].channel == 'none' || guildSettings[servers[o]].channel == undefined) {

                curServer.channels.filter(channel => channel.type == "text").random().send(messageToSend).catch(err => console.log(err));

            } else {

                curServer.channels.find('name', guildSettings[servers[o]].channel).send(messageToSend);
                
            }

        }
        message.channel.send("Message '" + messageToSend + "' sent across all servers!")
    } else {
        message.channel.send("**Error!** You do not have permission to execute this command!");
    }

}

module.exports.help = {
    name: "global-message",
    description: "BOT OWNER ONLY! Send a message to every server, used for update notes.",
    args: "[Message]",
    modCommand: false,
    botOwner: true,
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