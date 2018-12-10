const commando = require('discord.js-commando');
const Discord = require('discord.js');
const bot = new Discord.Client({
    unknownCommandResponse: false
});
bot.commands = new Discord.Collection();
//bot.dmcommands = new Discord.Collection();
const botconfig = require('./botconfig.json');
const guildSettings = require('./guildSettings.json');
const members = require('./members.json');
const levelSystem = require('./levelSystem.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
let cooldown = new Set();
var moment = require('moment');

const fs = require('fs');

const botName = "adprev";

console.log("Starting bot...");
console.log("Setting start time...");
try {
    botconfig.date = Date.now();
    console.log("Successfully set startup date");
} catch (error) {
    console.log("Failed to set startup date");
}

fs.readdir("./commands/", (err, files) => {

    console.log("Loading commands...");

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");

    if (jsfile.length <= 0) {

        bot.destroy();
        return console.log("FATAL! Error loading commands!");

    }
    
    files.forEach((f, i) => {

        let props = require(`./commands/${f}`);

        console.log(`Command ${f} Loaded!`);
        bot.commands.set(props.help.name, props)

    });
    console.log("Commands loaded!")
});

bot.on('ready', async() => {

    console.log(`${bot.user.username} Login succesfull!`);

    let setBotActivity = `Mention me!`;
    let guildSize = `${bot.guilds.size}`;

    setInterval(function(){
        
        let keys = Object.keys(members);
        
        if (setBotActivity == undefined) {

            setBotActivity = `Mention me!`;

        } else if (setBotActivity == `Mention me!`) {

            setBotActivity = `over ${keys.length} members`

        } else if (setBotActivity == `over ${keys.length} members`) {

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

                prefix: 'k!',
                channel: 'none',
                ban: false,
                actionMessage: true,
                isPremium: false,
                banMessage: "An advertising bot has been banned!",y
        

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

            prefix: 'k!',
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
    
    delete guildSettings[guild.id];

    fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
        if (err) console.log(err);
    });

});

bot.on('guildMemberAdd', (member) => {

    let getMemberName = String(member.user.username);
    
    runCheck(member, getMemberName);

});



bot.on('message', (message) => {

    if (bot.user.username == "Kōkoku nashi Dev Build" && message.author.id != 365452203982323712) return;
   
    // Check if channel type is DM.
    if (message.channel.type == "dm") return;

    // Make sure the bot doesnt respond to it's own messages.
    if (message.author.id == 503687810885353472){
        return;
    }

    // New member profile creation
    levelSystem.run(bot, message)

    // Check if the guild has a config file, just to be safe.

    if (!guildSettings[message.guild.id]) {

        // If it doesnt, give it one.
        guildSettings[message.guild.id] = {

            prefix: 'k!',
            channel: 'none',
            ban: false,
            actionMessage: true,
            isPremium: false,
            banMessage: "An advertising bot has been banned!",

        }

        fs.writeFile("./guildSettings.json", JSON.stringify(guildSettings), (err) => {
            if (err) console.log(err);
        });

        // And send an error message to notify them something went wrong.
        message.channel.send("**ERROR!** I could not find a configuration for this server! Please use " + guildSettings[message.guild.id].prefix + "help to get a list of my commands, and redo configuration!" );

        return;
    }

    let channel = bot.channels.find('name', guildSettings[message.guild.id].channel);


    // Check for banned tags in a message
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
    

    // Some command mumbo-jumbo.
    const prefix = guildSettings[message.guild.id].prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();



    // Check if message's are sent by users in the server.
    if (message.author.bot) return;

    // if a command is registered and the message starts with the prefix, run the command.
    if (command && message.content.startsWith(prefix)) {

        // Check if a user recently used a command
        if (cooldown.has(message.author.id)) {

            message.delete();

            return message.channel.send("**Error!** Please wait 5 seconds between commands!").then(message => message.delete(5000));
        }


        if (message.author.id != 365452203982323712) {
            cooldown.add(message.author.id);
            setTimeout(() => {
    
                cooldown.delete(message.author.id);
    
            }, 5000)
        }
        if (!members[message.author.id].isBanned){
            members[message.author.id].isBanned = false;
        }
        if (members[message.author.id].isBanned == true) {

            return message.channel.send("**Error!** You are banned from using this bot!");

        } else {
            
            let commandFile = bot.commands.get(command);
            if (!commandFile) return message.channel.send("**Error!** Unknown command!")
            commandFile.run(bot, message, args);

        }
    }
    


    if (message.mentions.members.first()) {

                
        let checkMention = String(message.mentions.members.first().user.username);

        if (checkMention.includes(bot.user.username)) {

            message.reply("My prefix for this server is: " + guildSettings[message.guild.id].prefix + " use the " + guildSettings[message.guild.id].prefix + "help command for more info");
        
        }
        

    }
});

bot.on('error', error =>{

    console.error
    bot.fetchUser("365452203982323712").then(user => {

        user.channel.send("**Error!** Bot error! \n" + error ).catch(err => {if (err) console.log(err);});

    })

});

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

bot.login(botconfig.token1);