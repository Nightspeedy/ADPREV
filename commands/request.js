const features = require('./../features.json');
const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

    if (args[0] == "list" && !args[1]) {

        if (message.author.id == 365452203982323712) {

            message.channel.send("listing first 25 requests");

            let msg = "List of requests:\n\n"

            for (i = 0; i < features.requests.length; i++) {

                if (i > 25) {

                } else {
                    msg += `Index [${i}] `;
                    msg += features.requests[i] + "\n";
                    console.log(msg)
                    
                }

            }

            message.channel.send(msg)

        } else {
            return message.channel.send("**Error!** You do not have permission to execute this command!");
        }
        return;
    } else if (args[0] == "remove") {

        if (message.author.id == 365452203982323712) {

            if (!args[1]) return;            
            if (isNaN(args[1])) return message.channel.send("**Error!** Expected argument is not a number!");

            try {

                features.requests.splice(args[1], 1);
                message.channel.send("Successfully removed request!");
                save()

            } catch(error) {
                console.log(error);
                message.channel.send("**Error!** Could not remove request!");
            }        
            

        } else {
            return message.channel.send("**Error!** You do not have permission to execute this command!");
        }

    } else {

        if (!args[0]) return message.channel.send("**Error!** No request.");

        var request = args.join(" ");
    
        features.requests.push(request);
        message.channel.send("Your request has been successfully added!");
        save();

    }
}
module.exports.help = {
    name: "request",
    description: "Request a new feature.",
    args: "[your feature] BOT-OWNER ONLY -> {list/remove [index number]}",
    modCommand: false,
    botOwner: false,
    utility: true,
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
    fs.writeFile("./features.json", JSON.stringify(features), (err) => {
        if (err) console.log(err);
    });
}