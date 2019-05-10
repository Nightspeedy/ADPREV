const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');

module.exports.run = async(bot, message, args, members) => {

    if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
    if (isNaN(args[0])) return message.channel.send("**Error!** Expected argument is not a number!");
    if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

    let member = await members.findOne({where: {id: message.author.id}});

    let toGamble = parseInt(args[0]);

    if (toGamble > 5000) return message.channel.send("**Hold up!** To protect you from yourself, i have a gambling limit of 5000 credits per gamble!")
    if (toGamble > member.dataValues.credits) return message.channel.send("**Error!** Insufficient funds!")

    let random1 = Math.floor(Math.random() * 100 + 1);
    let random2 = Math.floor(Math.random() * 100 + 1);
    let random3 = Math.floor(Math.random() * 100 + 1);

    let total = random1 + random2 + random3;
    let earned = 0;

    let embed = new Discord.RichEmbed()
    .setTitle("Slots")
    .setColor(getRandomColor())
    .addField("Your lucky numbers are", random1 + ", " + random2 + ", " + random3);

    var credits;

    if (total >= 290 && total < 300) {

        earned = toGamble * 25;
        earned -= toGamble;

        credits = member.dataValues.credits + earned;

        embed.addField("Jackpot! (X25)", "**You won** " + earned + " **Credits**, and got to keep what you gambled!")

        members.update({credits: credits}, {where: {id: message.author.id}});
        return message.channel.send(embed);
    } else if (total >= 275 && total < 290) {

        earned = toGamble * 8;
        earned -= toGamble;

        credits = member.dataValues.credits + earned;

        embed.addField("Huge win! (X8)", "**You won** " + earned + " **Credits**, and got to keep what you gambled!")

        members.update({credits: credits}, {where: {id: message.author.id}});
        return message.channel.send(embed);
    } else if (total >= 225 && total < 275){
        
        earned = toGamble * 4;
        earned -= toGamble;

        credits = member.dataValues.credits + earned;

        embed.addField("Big win! (X4)", "**You won** " + earned + " **Credits**, and got to keep what you gambled!")

        members.update({credits: credits}, {where: {id: message.author.id}});
        return message.channel.send(embed);
    } else if (total >= 165 && total < 225) {

        earned = toGamble * 2;
        earned -= toGamble;

        credits = member.dataValues.credits + earned;

        embed.addField("win! (X2)", "**You won** " + earned + " **Credits**, and got to keep what you gambled!")

        members.update({credits: credits}, {where: {id: message.author.id}});
        return message.channel.send(embed);
    } else {

        credits = member.dataValues.credits - toGamble;
        embed.addField("Lost", "**Oh no!** You lost everything!")

        members.update({credits: credits}, {where: {id: message.author.id}});
        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "gamble",
    description: "Gamble your coins. Get something, or get nothing.",
    args: "[Amount]",
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
    fs.writeFile("./../members.json", JSON.stringify(members), (err) => {
        if (err) console.log(err);
    });
}