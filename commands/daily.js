const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const botconfig = require('../botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, args, members) => {

    if (cooldown.has(message.author.id)) return message.channel.send("Whoa! Not so fast! (Ratelimited) \nYou can only use this command once per 12 hours!");

    if (!args[0]) {

        await members.findOne({where: {id: message.author.id}}).then(async(member) => {

            const embed = new Discord.RichEmbed()
            .setTitle(message.author.username)
            .setColor(getRandomColor())
            .addField("You claimed your daily credits!", "200 credits were added to your account!")
    
            let credits = member.dataValues.credits + 200;

            members.update({credits: credits}, {where: {id: message.author.id}});
    
            message.channel.send(embed);
    
            cooldown.add(message.author.id);
            
            setTimeout(() => {
                
                cooldown.delete(message.author.id);
    
            }, 43200000);

        });
    } else if (args[0]) {

        // Gift by mention
        if (message.mentions.members.first()) {
            
            if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
            if (message.author.id == message.mentions.members.first().user.id) return message.channel.send("**Error!** You cannot gift yourself coins! Use " + guildSettings[message.guild.id].prefix + "daily instead!");
    
            await members.findOne({where: {id: message.mentions.members.first().user.id}}).then( async(member) => {

                let randomExtra = Math.floor(Math.random() * 200 + 201);
    
                const embed = new Discord.RichEmbed()
                .setTitle(message.author.username)
                .setColor(getRandomColor())
                .addField("You gifted your daily credits!",  randomExtra + " credits were added to "+ message.mentions.members.first().user.username +"'s account!")
        
                let credits = member.dataValues.credits + randomExtra;

                members.update({credits: credits}, {where: {id: message.mentions.members.first().user.id}});
        
                message.channel.send(embed);
        
                cooldown.add(message.author.id);
                
                setTimeout(() => {
                    
                    cooldown.delete(message.author.id);
        
                }, 43200000);

            });


        } else {

            //do nothing

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