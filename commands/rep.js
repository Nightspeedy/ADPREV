const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, args, members) => {

    if (cooldown.has(message.author.id)) return message.channel.send("Whoa! Not so fast! (Ratelimited) \nYou can only use this command once per 12 hours!");

    if (!args[0]) {

        message.channel.send("Please mention a valid user, or provide a valid user ID! You can rep someone now.")

    } else if (args[0]) {

        // Gift by mention
        if (!message.mentions.members.first()) return message.channel.send("**Error!** Please mention a valid user!")
        if (message.mentions.members.first().user.bot) return message.channel.send("**Error!** Target user is a bot!");
        if (message.author.id == message.mentions.members.first().user.id) return message.channel.send("**Error!** You cannot rep yourself!");

        await members.findOne({where: {id: message.mentions.members.first().user.id}}).then( async(member) => {

            let reputation = member.dataValues.reputation;

            reputation += 1;

            members.update({reputation: reputation}, {where: {id: message.mentions.members.first().user.id}});

            const embed = new Discord.RichEmbed()
            .setTitle(message.author.username)
            .setColor(getRandomColor())
            .addField("You repped someone! ", message.author.username + " added reputation to " + message.mentions.members.first().user.username)
    
            message.channel.send(embed).catch(err => {if(err)console.log(err)});
    
            cooldown.add(message.author.id)
            
            setTimeout(() => {
                
                cooldown.delete(message.author.id);
    
            }, 43200000);

        });

    } else {

        //do nothing

    }

}
module.exports.help = {
    name: "rep",
    description: "Gives someone a reputation point.",
    args: "[@user]",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: true,
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