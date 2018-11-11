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

    let jsfile = files.filter(f => f.split('.').pop() === "js");
    if (jsfile.length <= 0) {
        return console.log("FATAL! Error loading commands!");
    }
    console.log(jsfile);
    
    files.forEach((f, i) => {

        console.log()

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

    //SET PREFIX
    //SET PREFIX
    //SET PREFIX
    if (command == "set-prefix" && message.content.startsWith(prefix)) {
        if (message.member.hasPermission("ADMINISTRATOR")) {

            if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
            if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);


            guildSettings[message.guild.id].prefix = args[0];

            message.channel.send("Server prefix set to: " + args[0]);

            save();

        } else {
            message.channel.send("You do not have permission to execute this command!");
        }
    }

    //SET CHANNEL
    //SET CHANNEL
    //SET CHANNEL
    if (command == "set-channel" && message.content.startsWith(prefix)) {
        if (message.member.hasPermission("ADMINISTRATOR")) {

            if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
            if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);
            if (!message.mentions.channels.first()) return message.channel.send("**Error!** Expected argument is not a channel!");

            guildSettings[message.guild.id].channel = message.mentions.channels.first().name;

            message.channel.send("Channel set to: " + args[0]);

            save();

        } else {
            message.channel.send("You do not have permission to execute this command!");
        }
    }

    //SET BAN
    //SET BAN
    //SET BAN
    if (command == "set-ban" && message.content.startsWith(prefix)) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
        
            if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
            if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

            if (args[0] == "true") {

                guildSettings[message.guild.id].ban = true;
                message.channel.send("Now banning join/leave advertisements!");

                save();

            } else if (args[0] == "false") {

                guildSettings[message.guild.id].ban = false;
                message.channel.send("Now kicking join/leave advertisements!");

                save();

            } else {
                message.channel.send("**Error!** Expected argument 'true' or 'false' but got: " + args[0]);
            }

        } else {
            message.channel.send("You do not have permission to execute this command!");            
        }
    }

    //SET ACTIONLOG
    //SET ACTIONLOG
    //SET ACTIONLOG
    if (command == "set-actionlog" && message.content.startsWith(prefix)) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
        
            if (!args[0]) return message.channel.send("**Error!** Please use at least 1 argument!");
            if (args[1]) return message.channel.send("**Error!** Too many arguments. 1 expected, got " + args.length);

            if (args[0] == "true") {

                guildSettings[message.guild.id].actionMessage = true;
                message.channel.send("Now sending action logs!");

            } else if (args[0] == "false") {

                guildSettings[message.guild.id].actionMessage = false;
                message.channel.send("Now hiding action logs!");

            } else {
                message.channel.send("**Error!** Expected argument 'true' or 'false' but got: " + args[0]);
            }

        } else {
            message.channel.send("**Error!** You do not have permission to execute this command!");            
        }
    }

    //SET MESSAGE
    //SET MESSAGE
    //SET MESSAGE
    if (command == "set-message" && message.content.startsWith(prefix)) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            if (guildSettings[message.guild.id].isPremium == true) {

                guildSettings[message.guild.id].banMessage = message.content.slice(prefix.length + command.length + 1);
                message.channel.send("Banmessage set to '" + guildSettings[message.guild.id].banMessage + "'");

            } else {
                message.channel.send("**Error!** You do not have ADPREV-Premium!");
            }

        } else {
            message.channel.send("**Error!** You do not have permission to execute this command!");            
        }
    }

    //SETTINGS
    //SETTINGS
    //SETTINGS
    if (command == "settings" && message.content.startsWith(prefix)){

        let settings = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle("Settings")
        .addBlankField(true)
        .addField("Command prefix", guildSettings[message.guild.id].prefix)
        .addField("Join/leave channel", guildSettings[message.guild.id].channel)
        .addField("Ban offenders", guildSettings[message.guild.id].ban)
        .addField("Action messages", guildSettings[message.guild.id].actionMessage)

        message.channel.send(settings).then(message);

    }
    //INVITE
    //INVITE
    //INVITE
    if (command == "invite" && message.content.startsWith(prefix)){

        message.channel.send("I am a public bot! Invite me to your own server using this link: \n https://discordapp.com/api/oauth2/authorize?client_id=503687810885353472&permissions=8&scope=bot");

    }

    //GLOBAL MESSAGE
    //GLOBAL MESSAGE
    //GLOBAL MESSAGE
    if (command == "global-message" && message.content.startsWith(prefix)){

        if (message.author.id == 365452203982323712) {

            let messageToSend = message.content.slice(command.length + 2);
            let servers = Object.keys(guildSettings);
            for (o = 0; o < servers.length; o++){

                let curServer = bot.guilds.get(servers[o]);
                //let curChannel = bot.curServer.channels.find('name', guildSettings[servers[o]].channel);

                console.log(o);

                if (guildSettings[servers[o]].channel == 'none' || guildSettings[servers[o]].channel == undefined) {

                    curServer.channels.filter(channel => channel.type == "text").random().send(messageToSend).catch(err => console.log(err));

                } else {

                    curServer.channels.find('name', guildSettings[servers[o]].channel).send(messageToSend);
                    
                }

                if (o == servers.length){

                    message.channel.send("Message sent to all servers!");

                }

            }
        } else {
            message.channel.send(errorCode(1));
        }
    }

    //FETCHINVITE
    //FETCHINVITE
    //FETCHINVITE
    if(command == "fetchinvite" && message.content.startsWith(prefix)) {

        if (message.author.id == 365452203982323712){

        } else {
            return message.channel.send("**Error!** You do not have permission to execute this command!");
        }

    }

    //HELP
    //HELP
    //HELP
    if (message.mentions.members.first()) {

        let checkMention = String(message.mentions.members.first().user.username);
        if (checkMention.includes(bot.user.username)) {

            message.reply("My prefix for this server is: " + guildSettings[message.guild.id].prefix + " use the " + guildSettings[message.guild.id].prefix + "help command for more info");

        } else {
            return;
        }
    }

    if (command == "help" && message.content.startsWith(prefix)) {

        let embed = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle("ADPREV Command Help")
        .addField("What is ADPREV?", "ADPREV is a bot developed by Asuna#1000. ADPREV is a configurable bot that bans/kicks any user that has a link in their username to advertise their social platforms, and deletes any welcoming messages.")
        .addBlankField(true)
        .addField("User with a link not kicked/banned and no message was deleted?", "Please contact Asuna#1000 and send her the link this user had in their username, the domain is probbably not registered within ADPREV's database yet.")
        .addBlankField(true)
        .addField(guildSettings[message.guild.id].prefix + "set-prefix [prefix]", "Set the command prefix.")
        .addField(guildSettings[message.guild.id].prefix + "set-channel [channel]", "Set your join/leave message channel.")
        .addField(guildSettings[message.guild.id].prefix + "set-ban [true/false]", "Toggle banning on or off.")
        .addField(guildSettings[message.guild.id].prefix + "set-message [true/false]", "Toggle action messages on or off.")
        .addField(guildSettings[message.guild.id].prefix + "settings", "See all your current settings.")
        .addField(guildSettings[message.guild.id].prefix + "invite", "Get the bot invite link to add it to your own server.")
        .addBlankField(true)
        .addField("Support", "For additional help, contact Asuna#1000");

        message.channel.send(embed)
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

bot.login(botconfig.token);