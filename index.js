const commando = require('discord.js-commando');
const Discord = require('discord.js');
const bot = new Discord.Client({
    unknownCommandResponse: false
});
bot.commands = new Discord.Collection();
const botconfig = require('./botconfig.json');
const guildSettings = require('./guildSettings.json');
const fs = require('fs');

console.log("Starting bot...");

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        return console.log("FATAL! Error loading commands!");
    }
    console.log(jsfile);
    
    files.forEach((f, i) => {

        let props = require(`./commands/${f}`);

        console.log(`command ${f} loaded!`);
        bot.commands.set(props.help.name, props)

    });

});

bot.on('ready', async() => {

    console.log(`${bot.user.username} Login succesfull!`);

    let setBotActivity = `Mention me!`;
    let guildSize = `${bot.guilds.size}`;

    setInterval(function(){
		
        if (setBotActivity == undefined) {

            setBotActivity = `Mention me!`;

        } else if (setBotActivity == `Mention me!`) {

            setBotActivity = `over ${bot.guilds.size} guilds!`;

        } else {

            setBotActivity = `Mention me!`;

            

        }

		bot.user.setActivity(setBotActivity, {type: "WATCHING"});
		console.log("Set Activity to: "+ setBotActivity);

    }, 60000)


    bot.user.setActivity(setBotActivity, {type: "WATCHING"});
    console.log("Logged in on " + guildSize + " guilds!")

    let keyArray = bot.guilds.keyArray();

    for (i = 0; i < keyArray.length; i++) {
        
        if (!guildSettings[keyArray[i]]) {

            guildSettings[keyArray[i]] = {

                prefix: '!!',
                channel: 'none',
                ban: false,
                actionMessage: true,
                isPremium: false,
                banMessage: "An advertising bot has been banned!",

        

            }
            console.log("Created object for: " + keyArray[i])
            fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
                if (err) console.log(err);
            });
        }
    }   

});

bot.on('guildCreate', (guild) => {

    if (!guildSettings[guild.id]) {

        guildSettings[guild.id] = {

            prefix: '!!',
            channel: 'none',
            ban: false,
            actionMessage: true,
            isPremium: false,
            banMessage: "An advertising bot has been banned!",

        }

        fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
            if (err) console.log(err);
        });

    }

});
bot.on('guildDelete', (guild) => {
    //do something with this soon
});

bot.on('guildMemberAdd', (member) => {

    let getMemberName = String(member.user.username);
    
    runCheck(member, getMemberName);

});

bot.on('message', (message) => {

    if (!guildSettings[message.guild.id]) {

        guildSettings[message.guild.id] = {

            prefix: '!!',
            channel: 'none',
            ban: false,
            actionMessage: true,
            isPremium: false,
            banMessage: "An advertising bot has been banned!",

        }

        fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
            if (err) console.log(err);
        });

        message.channel.send("**ERROR!** I could not find a configuration for this server! Please use " + guildSettings[message.guild.id].prefix + "help to get a list of my commands, and redo configuration!" );

        return;
    }


    let channel = bot.channels.find('name', guildSettings[message.guild.id].channel);
    if (message.author.id == 503687810885353472){
        return;
    }

    if (message.channel == channel && guildSettings[message.guild.id].channel != 'none' && message.author.bot ) {

        let mentioned = "null";

        if (message.mentions.members.first()) {

            mentioned = String(message.mentions.members.first().user.username);

        }
        for (i = 0; i <= botconfig.bannedTags.length; i++){

            if (message.content.includes(botconfig.bannedTags[i]) || mentioned.includes(botconfig.bannedTags[i])){
                
                message.delete();
                console.log("Message deleted!");

                return;
            }
        }
    }
    
    const prefix = guildSettings[message.guild.id].prefix;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    // Check if message's are sent by users in the server
    if (message.author.bot) return;
    // Check if channel type is DM
    if (message.channel.type == "dm") return;

    let commandFile = bot.commands.get(command);
    if (commandFile) commandFile.run(bot, message, args);


    if (message.mentions.members.first()) {

        let checkMention = String(message.mentions.members.first().user.username);
        if (checkMention.includes(bot.user.username)) {

            message.reply("My prefix for this server is: " + guildSettings[message.guild.id].prefix + " use the " + guildSettings[message.guild.id].prefix + "help command for more info");

        } else {
            return;
        }
    }
});

bot.on('error', console.error);

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

function runCheck(user, content){

    let counter = 0;

    if (guildSettings[user.guild.id].channel == 'none'){
        return;
    }

    for (i = 0; i <= botconfig.bannedTags.length; i++) {

        if(content.includes(botconfig.bannedTags[i])){

            counter++;

        }
        if (counter == 2){
            
            if (guildSettings[user.guild.id].ban == true) {

                user.ban("Advertisement Bot/user").catch(err => console.log(err));

                if(guildSettings[user.guild.id].actionMessage == true) {

                    bot.channels.find('name', guildSettings[user.guild.id].channel).send(guildSettings[user.guild.id].banMessage);
                    
                } else {
                    return;
                }

            } else {

                user.kick("Advertisement Bot/user").catch(err => console.log(err));

                if(guildSettings[user.guild.id].banMessage == true) {

                    bot.channels.find('name', guildSettings[user.guild.id].channel).send(guildSettings[user.guild.id].banMessage);
                    
                } else {
                    return;
                }

            }

            return;
        }


    }
    return;
}

let timesSaved = 0
setInterval(function(){

    fs.writeFile("./botconfig.json", JSON.stringify(botconfig), (err) => {
        if (err) console.log(err);
    });
    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });
    
    timesSaved++
    console.log("Saved any file changes, Saved: " + timesSaved + " times!");
    
}, 36000000);

bot.login(botconfig.token2);