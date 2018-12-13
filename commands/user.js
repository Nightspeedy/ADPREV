const members = require('./../members.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {


    if (!args[1]) return message.channel.send("**Error!** Please use at least 2 arguments!");
    if (args[0] != message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user! 1");
    args[0] = message.mentions.members.first().user.id;
    if (!members[args[0]]) return message.channel.send("**Error!** I could not find this user! 2");

    switch (args[1]) {
        case "reset":

            members[args[0]].level = 1;
            members[args[0]].exp = 0;
            members[args[0]].reputation = 0;
            members[args[0]].credits = 0;



            message.channel.send("Successfully reset user profile!");

            save();

            break;
        case "add-credits":
            
            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].credits)
            int2 = parseInt(args[2]);

            members[args[0]].credits = int1+int2;

            message.channel.send("Successfully added " + int2 + " Credits to user!");

            save();

            break;
        case "remove-credits":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].credits)
            int2 = parseInt(args[2]);

            members[args[0]].credits = int1-int2;

            message.channel.send("Successfully removed " + int2 + " Credits from user!");

            save();

            break;
        case "add-rep":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].reputation)
            int2 = parseInt(args[2]);

            members[args[0]].reputation = int1+int2;

            message.channel.send("Successfully added " + int2 + " reputation points to user!");

            save();

            break;
        case "remove-rep":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].reputation)
            int2 = parseInt(args[2]);

            members[args[0]].reputation = int1-int2;

            message.channel.send("Successfully removed " + int2 + " reputation points from user!");

            save();

            break;
        case "add-levels":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].levels)
            int2 = parseInt(args[2]);

            members[args[0]].reputation = int1+int2;

            message.channel.send("Successfully added " + int2 + " levels to user!");

            save();

            break;
        case "remove-levels":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(members[args[0]].level)
            int2 = parseInt(args[2]);

            members[args[0]].level = int1-int2;

            message.channel.send("Successfully removed " + int2 + " levels from user!");

            save();

            break;
        case "set-level":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(args[2]);

            members[args[0]].level = int1

            message.channel.send("Successfully set user's level to: " + int1);

            save();

            break;
        case "set-credits":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(args[2]);

            members[args[0]].credits = int1

            message.channel.send("Successfully set user's credits to: " + int1);

            save();

            break;
        case "set-rep":

            if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
            if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");

            int1 = parseInt(args[2]);

            members[args[0]].reputation = int1

            message.channel.send("Successfully set user's reputation to: " + int1);

            save();

    }

}

module.exports.help = {
    name: "user",
    description: "BOT OWNER ONLY! Used to add/remove/set/reset a user's levels/credits/reputation/profile",
    args: "[@user] [reset, add-credits/remove-credits/add-rep/remove-rep/add-levels/remove-levels/set-level/set-rep/set-credits [integral value]]",
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
function save() {
    fs.writeFile("./members.json", JSON.stringify(members), (err) => {
        if (err) console.log(err);
    });
}