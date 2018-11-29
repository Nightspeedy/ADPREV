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

const fs = require('fs');

const botName = "adprev";

console.log("Starting bot...");

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {

        bot.destroy();
        return console.log("FATAL! Error loading commands!");

    }
    
    files.forEach((f, i) => {

        let props = require(`./commands/${f}`);

        console.log(`command ${f} loaded!`);
        bot.commands.set(props.help.name, props)

    });

});

// fs.readdir("./dmcommands/", (err, files) => {

//     if(err) console.log(err);

//     let jsfile = files.filter(f => f.split(".").pop() === "js");
//     if (jsfile.length <= 0) {

//         bot.destroy();
//         return console.log("FATAL! Error loading commands!");

//     }
    
//     files.forEach((f, i) => {

//         let dmprops = require(`./dmcommands/${f}`);

//         console.log(`command ${f} loaded!`);
//         bot.dmcommands.set(props.help.name, dmprops)

//     });

// });

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

    const args1 = message.content.slice(0).trim().split(/ +/g);
    const messageLow = message.content.toLowerCase();

    if (message.content.startsWith("setServer") && message.author.id == 365452203982323712){

        if (!args1[1]) return message.author.send("Dewi, you forgot to give me the server ID...");
        if (isNaN(args1[1])) return message.author.send("I can't set the server if the ID is not a number Dewi...");
        if (args1[2]) return message.author.send("Hey Dewi, i dont need more then 1 argument...");

        botconfig.server = args1[1];

        
        message.author.send("Changed server to: " + args1[1]);

        fs.writeFile("./botconfig.json", JSON.stringify(botconfig), (err) => {
            if (err) console.log(err);
        });

    }
    if (message.content.startsWith("setChannel") && message.author.id == 365452203982323712){

        if (!args1[1]) return message.author.send("Dewi, you forgot to give me the server channel...");
        if (args1[2]) return message.author.send("Yo Dewi, i dont need more then 1 argument...");

        botconfig.channel = args1[1];

        message.author.send("Changed channel to: " + args1[1]);

        fs.writeFile("./botconfig.json", JSON.stringify(botconfig), (err) => {
            if (err) console.log(err);
        });

    }

    if (message.content.startsWith("toggleOnOff") && message.author.id == 365452203982323712) {

        if (botconfig.forwardMessages == true) {

            botconfig.forwardMessages = false;
            message.channel.send("Disabled message forwarding!");

        } else {

            botconfig.forwardMessages = true;
            message.channel.send("Enabled message forwarding");

        }

        fs.writeFile("./botconfig.json", JSON.stringify(botconfig), (err) => {
            if (err) console.log(err);
        });
    }

    // Forward DM messages to specified channel.
    if (message.channel.type == "dm" && message.author.id == 365452203982323712){

        if (message.content.startsWith("setChannel") || message.content.startsWith("setServer") || message.content.startsWith("toggleOnOff")) return;

        if (botconfig.forwardMessages == true) {
            
            let server = bot.guilds.get(botconfig.server);

            if (server == undefined) return message.channel.send("The server ID is invalid, or i am not a member of that server.");
            if (server.channels.find('name', botconfig.channel) == undefined) return message.channel.send("The channel name is invalid, i could not find it.");

            server.channels.find('name', botconfig.channel).send(message.content);
            

        } else {
            return;
        }

    }
    
    // Check if channel type is DM.
    if (message.channel.type == "dm") return;

    // Forward messages to Asuna#1000.
    if (botconfig.forwardMessages == true && message.author.id != 503687810885353472 && message.guild.id == botconfig.server) {

        if (!message.content) return;

        let embed = new Discord.RichEmbed()
        .setTitle("#"+message.channel.name)
        .addField(message.author.tag, message.content)
        .setColor(getRandomColor())
        .setAuthor(message.guild.name)
        .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)

        bot.fetchUser("365452203982323712").then(user => user.send(embed));
    }

    // New member profile creation
    if (!members[message.author.id]) {

        members[message.author.id] = {

            isBanned: false,
            level: 0,
            exp: 0,
            
        }
        fs.writeFile("./members.json", JSON.stringify(members), (err) => {
            if (err) console.log(err);
        });
    }

    // Check if the guild has a config file, just to be safe.
    if (!guildSettings[message.guild.id]) {

        // If it doesnt, give it one.
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

        // And send an error message to notify them something went wrong.
        message.channel.send("**ERROR!** I could not find a configuration for this server! Please use " + guildSettings[message.guild.id].prefix + "help to get a list of my commands, and redo configuration!" );

        return;
    }

    // Make sure the bot doesnt respond to it's own messages.
    let channel = bot.channels.find('name', guildSettings[message.guild.id].channel);
    if (message.author.id == 503687810885353472){
        return;
    }

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
        
        if (members[message.author.id].isBanned == true) {

            return message.channel.send("**Error!** You are banned from using this bot!");

        } else {
            
            let commandFile = bot.commands.get(command);
            if (!commandFile) return message.channel.send("**Error!** Unknown command!")
            commandFile.run(bot, message, args);
        
        }
    }
    
    //SEND MESSAGE DM
    //SEND MESSAGE DM
    //SEND MESSAGE DM
    if (messageLow.includes("kokoku") || messageLow.includes("nashi")|| messageLow.includes("kōkoku")) {

        if (members[message.author.id].isBanned) {
            return message.channel.send("**Error!** You are banned from using this bot!");
        } else {

            if (botconfig.server == message.guild.id && botconfig.forwardMessages == true) return;

            let embed = new Discord.RichEmbed()
            .setTitle("#"+message.channel.name)
            .addField(message.author.tag, message.content)
            .setColor(getRandomColor())
            .setAuthor(message.guild.name)
            .setFooter("Server ID: " + message.guild.id + " || user ID: " + message.author.id)

            bot.fetchUser("365452203982323712").then(user => user.send(embed));
        
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
    bot.fetchUser("365452203982323712").channel.send("**Error!** Bot error! \n" + error ).catch(err => {if (err) console.log(err);});

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

bot.login(botconfig.token2);