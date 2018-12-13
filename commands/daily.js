const members = require('./../members.json');
const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, args) => {

    if (cooldown.has(message.author.id)) return message.channel.send("Whoa! Not so fast! (Ratelimited) \nYou can only use this command once per 12 hours!");

    if (!args[0]) {


        const embed = new Discord.RichEmbed()
        .setTitle(message.author.username)
        .setColor(getRandomColor())
        .addField("You claimed your daily credits!", "200 credits were added to your account!")

        members[message.author.id].credits = members[message.author.id].credits + 200;

        message.channel.send(embed);

        cooldown.add(message.author.id)
        
        setTimeout(() => {
            
            cooldown.delete(message.author.id);

        }, 43200000);

    } else if (args[0]) {

        // Gift by mention
        if (message.mentions.members.first()) {
            
            if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
            if (message.author.id == message.mentions.members.first().user.id) return message.channel.send("**Error!** You cannot gift yourself coins! Use " + guildSettings[message.guild.id].prefix + "daily instead!");
    
            let randomExtra = Math.floor(Math.random() * 200 + 201);
    
            const embed = new Discord.RichEmbed()
            .setTitle(message.author.username)
            .setColor(getRandomColor())
            .addField("You gifted your daily credits!",  randomExtra + " credits were added to "+ message.mentions.members.first().user.username +"'s account!")
    
            members[message.mentions.members.first().user.id].credits = members[message.mentions.members.first().user.id].credits + randomExtra;
    
            message.channel.send(embed);
    
            cooldown.add(message.author.id)
            
            setTimeout(() => {
                
                cooldown.delete(message.author.id);
    
            }, 43200000);
        } else {
                    // Gift by ID

        if (!members[args[0]]) return message.channel.send("**Error!** I could not find this user!");
        if (message.author.id == args[0]) return message.channel.send("**Error!** You cannot gift yourself coins! Use " + guildSettings[message.guild.id].prefix + "daily instead!");

        bot.fetchUser(args[0]).then(user => {

            if (user.bot) return message.channel.send("**Error!** Target user is a bot!");
    
            let randomExtra = Math.floor(Math.random() * 200 + 201);

            const embed = new Discord.RichEmbed()
            .setTitle(message.author.username)
            .setColor(getRandomColor())
            .addField("You gifted your daily credits!",  randomExtra + " credits were added to "+ user.username +"'s account!")
    
            members[args[0]].credits = members[args[0]].credits + randomExtra;

            message.channel.send(embed);

            cooldown.add(message.author.id)
        
            setTimeout(() => {
                
                cooldown.delete(message.author.id);
    
            }, 43200000);

        }).catch(err => {

            if(err) console.log(err);

        });
        }


    } else {

        message.channel.send("**Error!** Unknown error!");

    }

}
module.exports.help = {
    name: "daily",
    description: "Claim your daily free credits.",
    args: "{@user}",
    modCommand: false,
    botOwner: false,
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