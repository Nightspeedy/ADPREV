const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    return message.channel.send("This command is under development! Please check back later!");

    if (!args[1]) return message.channel.send("**Error!** Please use at least 2 arguments!");

    guilds.findOne({ where: { id: args[0] }}).then( async(result) => {

        switch (args[0]) {
            
            case "levelup":

                switch(args[1]){

                    case "enable":

                        break;
                    case "disable":

                        break;
                
            }
        }
        message.channel.send
    });
}

module.exports.help = {
    name: "messages",
    description: "Enable/disable certain notification messages.",
    args: "[levelup] [enable/disable]",
    modCommand: true,
    botOwner: false,
    utility: false,
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
function save() {
    fs.writeFile("./members.json", JSON.stringify(members), (err) => {
        if (err) console.log(err);
    });
}