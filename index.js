const Discord = require('discord.js');
const bot = new Discord.Client({
    unknownCommandResponse: false
});
bot.commands = new Discord.Collection();
const botconfig = require('./botconfig.json');
const guildSettings = require('./guildSettings.json');
const members = require('./members.json');
const levelSystem = require('./levelSystem.js');
const forwarding = require('./forwarding.js');
const moment = require('moment');
const fs = require('fs');
let cooldown = new Set();


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
    console.log("Commands loaded!");
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

            setBotActivity = `over ${guildSize} guilds!`;

        } else {

            setBotActivity = `Mention me!`;

        }

		bot.user.setActivity(setBotActivity, {type: "WATCHING"});

    }, 60000)


    bot.user.setActivity(setBotActivity, {type: "WATCHING"});
    console.log("Logged in on " + guildSize + " guilds!")

    let keyArray = bot.guilds.keyArray();


    // check if all servers have a configuration
    for (i = 0; i < keyArray.length; i++) {
        
        if (!guildSettings[keyArray[i]]) {

            guildSettings[keyArray[i]] = {

                prefix: 'k!',
                logChannel: undefined,
                isPremium: false,  

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
            logChannel: undefined,
            isPremium: false,

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

});

bot.on('message', (message) => {

    if (bot.user.username == "Kōkoku nashi Dev Build" && message.author.id != 365452203982323712) return;
   
    forwarding.run(bot, message);

    // Check if channel type is DM.
    if (message.channel.type == "dm") return;

    // Make sure the bot doesnt respond to it's own messages.
    if (message.author.id == 503687810885353472) return;

    // Level system.
    levelSystem.run(bot, message)
    
    // Some command mumbo-jumbo.
    const prefix = guildSettings[message.guild.id].prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    // Check if message's are sent by users in the server.
    if (message.author.bot) return;

    // If a command is registered and the message starts with the prefix, run the command.
    if (command && message.content.startsWith(prefix)) {

        // Check if a user recently used a command
        if (cooldown.has(message.author.id)) {

            message.delete();

            return message.channel.send("**Error!** Please wait 5 seconds between commands!").then(message => message.delete(5000));
        }

        // Add a user to the timeout list
        if (message.author.id != 365452203982323712) {
            cooldown.add(message.author.id);
            setTimeout(() => {
    
                cooldown.delete(message.author.id);
    
            }, 5000)
        }

        // Make sure the code doesnt break here...
        if (!members[message.author.id].isBanned){
            members[message.author.id].isBanned = false;
        }

        // Check if a user is banned
        if (members[message.author.id].isBanned == true) {

            return message.channel.send("**Error!** You are banned from using this bot!");

        } else {
            
            // Run the command file
            let commandFile = bot.commands.get(command);
            if (!commandFile) return message.channel.send("**Error!** Unknown command!")
            commandFile.run(bot, message, args);

        }
    }
    
    // Check if the bot is mentioned, and send a help message
    if (message.mentions.members.first()) {

                
        let checkMention = String(message.mentions.members.first().user.username);

        if (checkMention.includes(bot.user.username)) {

            message.channel.send("My prefix for this server is: " + guildSettings[message.guild.id].prefix + " use the " + guildSettings[message.guild.id].prefix + "help command for more info");
        
        }
        

    }
});

bot.on('error', error =>{

    console.log(error);
    bot.fetchUser("365452203982323712").then(user => {

        user.send("**Error!** Bot error! \n" + error ).catch(err => {if (err) console.log(err);});

    })

});

bot.login(botconfig.token1);