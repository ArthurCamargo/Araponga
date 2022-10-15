// Author: Arthur Camargo
// Description: Plays the next song in the queue

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('next')
    .setDescription('Plays the next song song!'),
  async execute ({client, interaction}) {
      const queue = client.player.getQueue(interaction.guild)

      if (!queue) {
          await interaction.reply("I'm not playing anything!")
          return
      }

      queue.skip();


    
      const currentSong = queue.current;

      await interaction.reply({
          embeds: [
              new EmbedBuilder()
                .setDescription(`Skipped ** ${currentSong.title} ** `)
                .setThumbnail(currentSong.thumbnail)
          ]
      })
  }
}
