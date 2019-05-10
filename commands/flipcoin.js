const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();
let toGamble;

module.exports.run = async(bot, message, args, members) => {

    return message.channel.send("**Hold up!** This command is under development!");

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");

    args1 = args[0].toLowerCase();

    if (args1 != "heads" && args1 != "tails") return message.channel.send("**Error!** Invalid argument! Valid arguments are: `tails` and `heads`");

    let member = await members.findOne({where: {id: message.author.id}});

    if(args[1]) {

        toGamble = parseInt(args[1]);
        if (isNaN(args[1])) return message.channel.send("**Error! Expected argument is not a number!");
        if (toGamble > 1000) return message.channel.send("**Hold up!** To protect you from yourself, i have a limit of 1000 credits per coin toss!")
        if (toGamble > member.dataValues.credits) return message.channel.send("**Error!** Insufficient funds!")
    }

    let rand = Math.floor(Math.random() * 100 + 1);

    let flip = new Discord.RichEmbed()
    .setTitle("Coin toss")
    .setColor(getRandomColor())
    .addField("Flipping!", "A coin has been tossed...")
    
    let id = message.author.id;

    message.channel.send(flip).then(message => {

        setTimeout(async function() {

            let embed = new Discord.RichEmbed()
            .setTitle("Coinflip")
            .setColor(getRandomColor())

            if (rand >= 50) {

                embed.addField("Heads!", "The coin landed on heads!");

                if(args[1]) {
                    
                    let args1 = String(args[1]);
                    args1 = args1.toLowerCase();

                    if (args1.includes("heads")) {

                        console.log("Heads win!");

                        embed.addField("Win!", `You won ${toGamble} credits!`);
            
                        let credits = member.dataValues.credits + toGamble;
            
                        await members.update({credits: credits}, {where: {id: id}});
                    } else {
                        
                        console.log("Heads loss!");

                        embed.addField("Lost!", `You lost everything!`);
            
                        let credits = member.dataValues.credits - toGamble;
            
                        await members.update({credits: credits}, {where: {id: id}});
                    }
                }
            } else {
        
                embed.addField("Tails!", "The coin landed on tails!");
        
                if(args[1]) {

                    let args1 = String(args[1]);
        
                    if (args1 === "tails") {

                        embed.addField("Win!", `You won ${toGamble} credits!`);
            
                        let credits = member.dataValues.credits + toGamble;
            
                        await members.update({credits: credits}, {where: {id: id}});
                    } else {
                        
                        embed.addField("Lost!", `You lost everything!`);
            
                        let credits = member.dataValues.credits - toGamble;
            
                        await members.update({credits: credits}, {where: {id: id}});
                    }
                }
            }
        
            message.edit(embed);

        }, 3000)

    })
}
module.exports.help = {
    name: "flipcoin",
    description: "Flip a coin, guess what it lands on. You can also gamble with it!",
    args: "[heads/tails] {amount}",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: false,
    games: true,
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