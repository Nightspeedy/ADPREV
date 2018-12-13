const members = require('./members.json');
const fs = require('fs');
const forwarding = require('./forwarding.json');
const Discord = require('discord.js');
let started = false;
const commands = ["k!server", "k!channel", "k!toggle", "k!settings"];

module.exports.run = async(bot, message) => {

    // DM commands
    const args = message.content.trim().split(/ +/g);
    const command = args.shift();

    let messageLow = String(message).toLowerCase();

    // Forward messages to Asuna#1000.
    if (message.channel.type != "dm") {
        if (forwarding.forwardMessages == true && message.author.id != 503687810885353472 && message.guild.id == forwarding.server) {

            if (!message.content) return;
    
            let embed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle(message.guild.name)
            .setDescription(message.content)
            .addField(message.author.tag, "#"+message.channel.name + " || " + message.channel.id)
            .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)
    
            bot.fetchUser("365452203982323712").then(user => user.send(embed));
        }
    }

    // If message includes "", send DM.
    if (messageLow.includes("kokoku") || messageLow.includes("nashi")|| messageLow.includes("kōkoku") && message.channel.type != "dm") {

        if (members[message.author.id].isBanned) {
            return;
        } else {

            if (forwarding.server == message.guild.id && forwarding.forwardMessages == true) return;

            let embed = new Discord.RichEmbed()
            .setTitle("#"+message.channel.name)
            .addField(message.author.tag, message.content)
            .setColor(getRandomColor())
            .setAuthor(message.guild.name)
            .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)

            bot.fetchUser("365452203982323712").then(user => user.send(embed));
        
        }
    }
    
    // forward messages to specific channel


// Commands below
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

    if (message.channel.type == "dm") {

        if (message.author.id != 365452203982323712) return;
        if (!message.content) return;

        if (command == "k!channel") {

            if (!args[0]) return message.channel.send("Please provide a channel ID");

            try {

                if (bot.channels.get(args[0]) == undefined) return message.channel.send("Could not set target channel: ID invalid!");
                forwarding.channel = args[0];
                return message.channel.send("Successfully set target channel!");

            } catch(err) {

                console.lor(err);
                return message.channel.send("Could not set target channel!");
                
            }

        } else if (command == "k!server") {

            if (!args[0]) return message.channel.send("Please provide a channel ID");

            try {

                if (bot.guilds.get(args[0]) == undefined) return message.channel.send("Could not set target server: ID invalid!");
                forwarding.server = args[0];
                return message.channel.send("Successfully set target server!");

            } catch(err) {

                console.log(err);
                return message.channel.send("Could not set target server!");
                
            }

        } else if (command == "k!toggle") {
            
            if (forwarding.forwardMessages == true) {

                forwarding.forwardMessages = false;
                return message.channel.send("Message forwarding is now disabled!");

            } else {

                forwarding.forwardMessages = true;
                return message.channel.send("Message forwarding is now enabled!");

            }


        } else if (command == "k!settings") {

            let getServer;
            let getChannel;

            try {
                getServer = await bot.guilds.get(forwarding.server).name;
            } catch {
                getServer = undefined;
            }
            try {
                getChannel = await bot.channels.get(forwarding.channel).name;
            } catch {
                getChannel = undefined;
            }

            let embed = new Discord.RichEmbed()
            .setTitle("Current forwarding settings")
            .addField("Server", getServer)
            .addField("Channel", "#"+getChannel)
            .addField("Forwarding enabled", forwarding.forwardMessages);

            return message.channel.send(embed);

        }

    }

    // FORWARD DM TO SERVER
    if (forwarding.forwardMessages == true && message.channel.type == "dm" && message.author.id == 365452203982323712) {

        if (message.author.id == bot.user.id) return;
        if (!message.content) return;

        for (i = 0; i < commands.length; i++){

            if (message.content.startsWith(commands[i])) return;

        }

        let getServer;
        let getChannel;

        try {
            getServer = await bot.guilds.get(forwarding.server).name;
        } catch {
            getServer = undefined;
        }
        try {
            getChannel = await bot.channels.get(forwarding.channel).name;
        } catch {
            getChannel = undefined;
        }

        if (getServer == undefined) return message.channel.send("Uncaught reference error: getServer is not defined");
        if (getChannel == undefined) return message.channel.send("Uncaught reference error: getChannel is not defined");

        bot.guilds.get(forwarding.server).channels.get(forwarding.channel).send(message.content).then(message => {

            

        }).catch(err => {

            if (err) console.log(err);

            message.channel.send("I could not forward this message");

        });

    }
}

// Get a random color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}