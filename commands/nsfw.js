const guildSettings = require('./../guildSettings.json');
const fs = require('fs');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bannedTags = ["shota", "loli", "guro", "guru"];

module.exports.run = async(bot, message, args, members) => {

    run(bot, message, args, members);

}

module.exports.help = {
    name: "nsfw",
    description: "Find yourself something nice on [mobooru.com](https://mobooru.com) \n You can add \n**rating:s** for Safe pictures `NOTE!` Safe != safe for work! Pics can still contain nudity!\n**rating:q** for Questionable pictures.\n**rating:e** for Explicit pictures",
    args: "{Search tags here} {rating:s/q/e}",
    modCommand: false,
    botOwner: false,
    utility: false,
    social: false,
    games: false,
    nsfw: true,
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
function run (bot, message, args, members) {
    if (!message.channel.nsfw) return message.channel.send('**Error!** You can only use this command in a NSFW channel!')
    let searchQuery = args.join(' ')
  
    for (let i = 0; i < bannedTags.length; i++) {
      if (message.content.toLowerCase().includes(bannedTags[i])) return message.channel.send('**Error!** This search term is banned! Please try to use a different search term!')
    }
  
    if (!args[0]) {
      searchQuery = '*'
    }
  
    message.channel.send('Searching on mobooru...').then(async (message) => {
      const apiurl = `https://mobooru.com/api/search/order:random  ${searchQuery}/1/0?filters=sqe`
      let res = await fetch(apiurl)
      res = await res.json()
  
      if (res[0]) {
        let rating
        let color
  
        let invalidTags = bannedTags.filter(bannedTag => res[0].tags.indexOf(bannedTag) > -1)
        let retries = 0
  
        while (invalidTags.length > 0 && retries < 10) {
          res = await (await fetch(apiurl)).json()
          if (!res[0]) throw new Error('FETCH_FAILED')
          invalidTags = bannedTags.filter(bannedTag => res[0].tags.indexOf(bannedTag) > -1)
          retries++
        }
  
        if (invalidTags.length > 0) {
          throw new Error('The chance of this happening is like 1/10000000000 lol')
        }
  
        switch (res[0].rating) {
          case 's':
            rating = 'Safe'
            color = '#76db82'
            break
          case 'q':
            rating = 'Questionable'
            color = '#edc955'
            break
          case 'e':
            rating = 'Explicit'
            color = '#ef5d5d'
            break
        }
  
        let embed = new Discord.RichEmbed()
          .setTitle('Rating: ' + rating)
          .setColor(color)
  
        if (args[0]) embed.addField('Tags used', args.join(', '))
  
        await embed.setImage(`https://mobooru.com/api/image/${res[0].query}.${res[0].filetype}`)
        embed.setFooter('Powered by Mobooru.com || Mobooru, the modern booru browser.')
  
        message.edit(embed)
      } else {
        message.edit('Your search term dit not return any images! Please try to use a different search term.')
      }
    }).catch(err => { console.log(err) })
  }