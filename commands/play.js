// Author: Arthur Camargo
// Description: Play command that starts a stream from a youtube url

const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription('Plays a song!')
    .addSubcommand(subcommand => 
        subcommand
            .setName('search')
            .setDescription("Searches for a song on youtube.")
            .addStringOption(option => 
                option
                    .setName('searchterms')
                    .setDescription('seachkeywords')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('playlist')
            .setDescription("Play a playlist url from youtube.")
            .addStringOption(option => 
                option
                    .setName('url')
                    .setDescription('Playlist url')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand
            .setName('song')
            .setDescription("Play a song from a youtube url.")
            .addStringOption(option => 
                option
                    .setName('url')
                    .setDescription('Url of the song')
                    .setRequired(true)
            )
    ),
    execute: async ({client, interaction}) => {
      if (!interaction.member.voice.channel) {
          await interaction.reply("You must be inside a voice channel, try again when you are stronger.")
          return;
      }

      const queue = await client.player.createQueue(interaction.guild)

      if(!queue.connection) await queue.connect(interaction.member.voice.channel)

      let embed = new EmbedBuilder();

      if(interaction.options.getSubcommand() === "song") {
          let url = interaction.options.getString("url")

          const result = await client.player.search(url, {
              requestedBy: interaction.user,
              searchEngine: QueryType.YOUTUBE_VIDEO
          })


          if (result.tracks.length === 0) {
              await interaction.reply("No results found. Do you really know how to write?")
              return
          }

          const song = result.tracks[0]
          await queue.addTrack(song)

          embed
            .setDescription(`Added **[${song.title}](${song.url})** to the queue, are you happy now?`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `We will listen to this sh*t for ${song.duration}`})
      } else if(interaction.options.getSubcommand() === "playlist") {
          let url = interaction.options.getString("url")

          const result = await client.player.search(url, {
              requestedBy: interaction.user,
              searchEngine: QueryType.YOUTUBE_PLAYLIST
          })

          if (result.tracks.length === 0) {
              await interaction.reply("No results found. Do you really know how to write?")
              return
          }

          const playlist = result.tracks
          await queue.addTracks(playlist)

          embed
            .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue, are you happy now?`)
            .setThumbnail(playlist.thumbnail)
            .setFooter({text: `We will listen to this sh*t for ${playlist.duration}`})
      } else if(interaction.options.getSubcommand() === "search") {
          let url = interaction.options.getString("searchterms")

          const result = await client.player.search(url, {
              requestedBy: interaction.user,
              searchEngine: QueryType.AUTO
          })

          if (result.tracks.length === 0) {
              await interaction.reply("No results found. Do you really know how to write?")
              return
          }

          const song = result.tracks[0]
          console.log(song)
          await queue.addTrack(song)

          embed
            .setDescription(`Added **[${song.title}](${song.url})** to the queue, are you happy now?`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `We will listen to this sh*t for ${song.duration}`})
      }

      if(!queue.playing) await queue.play()

      console.log(embed)
      await interaction.reply({
          embeds: [embed]
      })
  }
}
