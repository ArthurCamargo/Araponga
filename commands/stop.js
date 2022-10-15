// Author: Arthur Camargo
// Description: Stops the song in the queue

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing the current song!'),
  async execute ({client, interaction}) {
      const queue = client.player.getQueue(interaction.guild)

      if (!queue) {
          await interaction.reply("I'm not playing anything!")
          return
      }

      queue.stop();

      await interaction.reply("Stopped the song, now we can be happy again!")
  }
}
