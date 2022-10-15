const fs = require('node:fs') // Can make file system requests
const path = require('node:path') // Used to facilitated using paths

const { REST, Routes } = require('discord.js')
const { clientId, guildId, token } = require('./config.json')

const rest = new REST({ version: '10' }).setToken(token)

const commands = []
const commandsPath = path.joins(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  commands.push(command.data.toJSON())
}

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
  .catch(console.error)

// Deleting your commands inside discord
// // for guild-based commands
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
//  .then(() => console.log('Successfully deleted guild command'))
//  .catch(console.error);
//
// // for global commands
// rest.delete(Routes.applicationCommand(clientId, 'commandId'))
//  .then(() => console.log('Successfully deleted application command'))
//  .catch(console.error);
