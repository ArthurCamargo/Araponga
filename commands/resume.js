// Author: Arthur Camargo
// Description: Resume the actual song in the queue

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the current song in the queue!'),
  async execute ({client, interaction}) {
      const queue = client.player.getQueue(interaction.guild)

      if (!queue) {
          await interaction.reply("I'm not playing anything!")
          return
      }

      queue.setPaused(false);

      await interaction.reply("Resumed the song, welcome to hell again!")
  }
}
