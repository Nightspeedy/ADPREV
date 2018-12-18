const fs = require('fs');
const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message, members) => {

    if(message.author.bot) return;
    
    //Check for the user's data
    await members.findOrCreate({ where: { id: message.author.id }, defaults: {
        id: message.author.id,
        isBanned: false,
        level: 1,
        exp: 0,
        reputation: 0,
        credits: 0,
    }}).spread( async(result, isCreated) => {

        if(!isCreated) {

            // check cooldown
            if (cooldown.has(message.author.id)) return;

            // add someone to cooldown
            cooldown.add(message.author.id);
        
            // set cooldown
        
        
            // check if user is banned, if banned, return
            if (result.dataValues.isBanned == true) return;
        
            // set all levelup variables
            let randomExp = Math.floor(Math.random() * 20 + 11);
            let randomCre = Math.floor(Math.random() * 4 + 1);
        
            let nxtLvl = result.dataValues.level * botconfig.level;

            let exp = result.dataValues.exp + randomExp;
            let credits = result.dataValues.credits + randomCre;
        
            // add random EXP to user's current EXP
            await members.update({exp: exp, credits: credits,}, {where: { id: message.author.id}});
        
            // if user has more EXP then needed, level them up
            if (result.dataValues.exp >= nxtLvl){
        
                let level = result.dataValues.level + 1;
                result.dataValues.exp = 0;
        
                let embed = new Discord.RichEmbed()
                .setTitle("Level up!")
                .setColor(getRandomColor())
                .addField(message.author.username + " Leveled up!", "You are now level " + level);
        
                message.channel.send (embed);
        
                await members.update({exp: exp, level: level}, {where: { id: message.author.id}});
        
            }
            setTimeout(() => {
                cooldown.delete(message.author.id);
            }, 60000);
        }
    });
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
    fs.writeFile("./members.json", JSON.stringify(members), (err) => {
        if (err) console.log(err);
    });
}