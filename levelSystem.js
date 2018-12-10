const members = require('./members.json');
const fs = require('fs');
const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
let cooldown = new Set();

module.exports.run = async(bot, message) => {

    if(message.author.bot) return;

    if (!members[message.author.id]) {

        // generate user profile if none exists
        members[message.author.id] = {

            isBanned: false,
            level: 1,
            exp: 0,
            reputation: 0,
            credits: 0,
            
        }
        fs.writeFile("./members.json", JSON.stringify(members), (err) => {
            if (err) console.log(err);
        });
    }

    // check cooldown
    if (cooldown.has(message.author.id)) return;

    // add someone to cooldown
    cooldown.add(message.author.id);

    // set cooldown


    // check if user is banned, if banned, return
    if (members[message.author.id].isBanned) return;

    // check if user has all properties
    if (!members[message.author.id].isBanned) {
        members[message.author.id].isBanned = false;
        save();
    }
    if (!members[message.author.id].level) {
        members[message.author.id].level = 1;
        save();
    }
    if (!members[message.author.id].exp) {
        members[message.author.id].exp = 0;
        save();
    }
    if (!members[message.author.id].reputation) {
        members[message.author.id].reputation = 0;
        save();
    }
    if (!members[message.author.id].credits) {
        members[message.author.id].credits = 0;
    }

    // set all levelup variables
    let level = members[message.author.id].level;
    let exp = members[message.author.id].exp;
    let randomExp = Math.floor(Math.random() * 20 + 11);
    let randomCre = Math.floor(Math.random() * 4 + 1);
    let nxtLvl = level * botconfig.level;

    // add random EXP to user's current EXP
    members[message.author.id].exp = members[message.author.id].exp + randomExp;
    members[message.author.id].credits = members[message.author.id].credits + randomCre;


    // Save file
    save();

    // if user has more EXP then needed, level them up
    if (exp >= nxtLvl){

        members[message.author.id].level = members[message.author.id].level + 1;
        members[message.author.id].exp = 0;

        let embed = new Discord.RichEmbed()
        .setTitle("Level up!")
        .setColor(getRandomColor())
        .addField(message.author.username + " Leveled up!", "You are now level " + members[message.author.id].level);

        message.channel.send (embed)

        // Save file
        save();
    }
    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, 60000)
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