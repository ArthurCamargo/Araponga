// Author: Arthur Camargo
// Description: Show the musics in the queue

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QueryType } = require('discord-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the songs in the queue'),
    async execute ({client, interaction}) {
        const queue = client.player.getQueue(interaction.guild)
        if (!queue || !queue.playing) {
            await interaction.reply("There is no song playing!")
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i + 1})  [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")
    
        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`** Currently Playing: **\n \' ${currentSong.title}'\n\n ** Queue:** \n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
