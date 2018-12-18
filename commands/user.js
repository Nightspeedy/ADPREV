const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if(message.author.id != 365452203982323712) return message.channel.send("**Error!** Usage of this command is restricted!");
    if (!args[1]) return message.channel.send("**Error!** Please use at least 2 arguments!");
    if (!message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user! 1");
    args[0] = message.mentions.members.first().user.id;


    members.findOne({ where: { id: args[0] }}).then( async(result) => {

        let isBanned = result.dataValues.isBanned;
        let level = result.dataValues.level;
        let exp = result.dataValues.exp;
        let reputation = result.dataValues.reputation;
        let credits = result.dataValues.credits;

        switch (args[1]) {
            case "reset":
    
                isBanned = false;
                level = 1;
                exp = 0;
                reputation = 0;
                credits = 0;

                await members.update({isBanned: isBanned, level: level, exp: exp, reputation: reputation, credits: credits}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully reset user profile!");

                }).catch(err => {
                    message.channel.send("Could not reset user profile!");
                })


                break;
            case "add-credits":
                
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(credits);
                int2 = parseInt(args[2]);
    
                credits = int1+int2;
    
                await members.update({credits: credits}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully added " + int2 + " Credits to user!");

                }).catch(err => {
                    message.channel.send("Could not add credits to user!");
                });
    
                break;
            case "remove-credits":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(credits);
                int2 = parseInt(args[2]);
    
                if (int2 > int1) return message.channel.send("**Error!** User doesnt have enough credits!")

                credits = int1-int2;
    
                await members.update({credits: credits}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully removed " + int2 + " Credits from user!");

                }).catch(err => {
                    message.channel.send("Could not remove credits from user!");
                });
    
                break;
            case "add-reputation":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(reputation);
                int2 = parseInt(args[2]);
    
                reputation = int1+int2;
    
                await members.update({reputation: reputation}, {where: {id: args[0]}}).then(() => {

                message.channel.send("Successfully added " + int2 + " reputation points to user!");

                }).catch(err => {
                    message.channel.send("Could not add reputation points to user!");
                });
    
                break;
            case "remove-reputation":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(reputation);
                int2 = parseInt(args[2]);
    
                reputation = int1-int2;
    
                await members.update({reputation: reputation}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully removed " + int2 + " reputation points from user!");

                }).catch(err => {
                    message.channel.send("Could not remove reputation points from user!");
                });
    
                break;
            case "add-levels":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(level);
                int2 = parseInt(args[2]);
    
                level = int1+int2;

                await members.update({level: level}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully added " + int2 + " levels to user!");

                }).catch(err => {
                    message.channel.send("Could not add levels to user!");
                });
    
                break;
            case "remove-levels":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(level)
                int2 = parseInt(args[2]);
    
                level = int1-int2;
    
                await members.update({level: level}, {where: {id: args[0]}}).then(() => {

                message.channel.send("Successfully removed " + int2 + " levels from user!");

                }).catch(err => {
                    message.channel.send("Could not remove levels from user!");
                });
    
                break;
            case "set-level":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(args[2]);
    
                level = int1;
    
                await members.update({level: level}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully set user level to: " + int1 );
    
                }).catch(err => {
                    message.channel.send("Could not set user level!");
                });
    
                break;
            case "set-credits":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(args[2]);
    
                credits = int1;
    
                await members.update({credits: credits}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully set user credits to: " + int1 );
    
                }).catch(err => {
                    message.channel.send("Could not set user credits!");
                });
    
                break;
            case "set-reputation":
    
                if (!args[2]) return ("**Error!** Please use at least 3 arguments!");
                if (isNaN(args[2])) return message.channel.send ("**Error!** Expected argument is not a number!");
    
                int1 = parseInt(args[2]);
    
                reputation = int1
    
                await members.update({reputation: reputation}, {where: {id: args[0]}}).then(() => {

                    message.channel.send("Successfully set user level to: " + int1 );
    
                }).catch(err => {
                    console.log(err);
                    message.channel.send("Could not set user reputation points!");
                })
    
        }
    });
}

module.exports.help = {
    name: "user",
    description: "BOT OWNER ONLY! Used to add/remove/set/reset a user's levels/credits/reputation/profile",
    args: "[@user] [reset, add-credits/remove-credits/add-reputation/remove-reputation/add-levels/remove-levels/set-level/set-reputation/set-credits [integral value]]",
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