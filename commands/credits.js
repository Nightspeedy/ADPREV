const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, args, members) => {

    let embed = new Discord.RichEmbed()
    .setColor(getRandomColor())

    let user = await members.findOne({where: {id: message.author.id}})

    if (!args[0]) {

        await members.findOne({where: {id: message.author.id}}).then( async(member) => {

            embed.setTitle(message.author.username+"'s Credits")
            .setDescription("You have " + member.dataValues.credits + " Credits!")
            
            return message.channel.send(embed);

        });
    } else if (args[0]) {

        
        if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
        if (!message.mentions.members.first()) return message.channel.send("**Error!** I could not find this user!");

        if(args[1]) {

            const id1 = message.author.id;
            const id2 = message.mentions.members.first().user.id;
            let pin = Math.floor(Math.random() * 9000 + 1001);

            const filter = response => {

                let someVar = false;

                if (response.content == pin && message.author.id == response.author.id) someVar = true;
                if (response.content != pin && message.author.id == response.author.id) message.channel.send("**Error!** Pin is incorrect");

                return someVar;
            }

            if (isNaN(args[1])) return message.channel.send("**Error!** Expected argument is not a number!");
            if (args[1] > user.dataValues.credits) return message.channel.send("Error! You have insufficient funds!");



            message.channel.send(`Please type the pin code to confirm this transaction: \`${pin}\` `).then(() => {

                message.channel.awaitMessages(filter, {maxMatches: 1, time: 10000, errors: ['time'] }).then(collected => {

                    message.channel.send("Sending funds...").then( async(message) => {

                        await members.findOne({where: {id: id2}}).then( async(member) => {
    
                            let credits = member.dataValues.credits + parseInt(args[1]);

                            await members.update({credits: credits}, {where: {id: id2}})

                            credits = user.dataValues.credits - parseInt(args[1]);

                            await members.update({credits: credits}, {where: {id: id1}})

                            message.edit("Successfully sent funds!");

                        });
                    })
                }).catch(collected => {

                    message.channel.send("Your fund transfer request timed out.");
                });
            });
        } else {

            await members.findOne({where: {id: message.mentions.members.first().user.id}}).then( async(member) => {
    
                embed.setTitle(message.mentions.members.first().user.username +"'s Credits")
                .setDescription("They have " + member.dataValues.credits + " Credits!")
        
                return message.channel.send(embed);
            });
        }
    } else {
        return message.channel.send("**Error!** Unknown Error!");
    }
}
module.exports.help = {
    name: "credits",
    description: "Check your credit balance, or send your money arround.",
    args: "{@user} {amount}",
    modCommand: false,
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
function save(){
    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });
}