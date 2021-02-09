# Easier Discord Bot 

## Functions

### Start Functions

#### Set Your Bot API Token
```javascript
const Bot = require("@djs-premade/discordbot-premade");
Bot.setToken("<Your Bot Token>");
```

#### Set Your Prefix
Default prefix is `!`
If you would like to keep it as `!` you won’t need this next line of code
```javascript
Bot.setPrefix("#")
```

### You can also change the embed message coloring, this will show if you use the `bot.helpCmd()` when using !help
```javascript
Bot.embedColor = "hexColor"
```

#### Make your commands
```javascript
Bot.cmds([
  {
    name: "ping",
    description: "Get a bot response",
    usage: Bot.prefix+"ping",
    callback: (message, args) => {
      message.reply("Pong!");
    }
  },
]);
```
##### OR
With the newly implemented command handler, you can now load commands as seperate files instead of packing all your commands in 1 file.
```javascript
// index.js
Bot.commandsFolder("commands")
/*
This function will load all files in the "commands" directory
*/

// commands/help.js
module.exports = {
    name: 'help',
    usage: `${Bot.prefix}help`,
    description: 'Get a list of commands',
    callback: (message, args) => {
        function_here
    }
}
```

#### Check if user has permission
```javascript
Bot.cmds([
  {
    name: "ban",
    permission: "BAN_MEMBERS",
    description: "Ban a user",
    usage: bot.prefix+"ban",
    callback: (message, args) => {
      function_here
    }
  }
]);
```

#### Log all messages/commands in console
```javascript
Bot.msgLogging = <true/false>
```
Default value: false

#### Run the bot!
```javascript
Bot.ready();
```
**OR**
```javascript
Bot.ready(() => {
  function_here
})
```

Optional function: You don’t need this, but for people who need variables initialized on bot startup this is where you would do it.

#### MySQL Integration
With the latest patch, MySQL was implemented. Here are the MySQL functions:
```javascript
const Bot = require("@djs-premade/discordbot-premade");
const sqlData = {
    host: "db-host",
    user: "db-username",
    password: "db-password",
    database: "db-name"
}
Bot.mysql(sqlData).createTable('users', '(name VARCHAR(255), password VARCHAR(255))');

Bot.mysql(sqlData).insertInto('users', 'name, password', 'testing, password');

Bot.mysql(sqlData).delete('users', 'name', 'testing');

Bot.mysql(sqlData).findOneAndUpdate({
    table: 'users', // Find The table
    findCol: 'name', // Make it only update the value where this column equals findColVal
    findColVal: 'testing', // Refer to above comment
    column: 'password', // This sets the column value it will change
    newVal: 'newpassword', // This will set the new value from column referenced in 'column'
})

/*
Find Two And Update is the same as Find One And Update except it checks for 2 different columns
*/

Bot.mysql(sqlData).findTwoAndUpdate({
    table: 'users', // Find The table
    findCol: 'name',
    find2Col: 'email',
    findColVal: 'testing',
    find2ColVal: 'test@test.com',
    column: 'password',
    newVal: 'newpassword',
})

** Bot.mysql(sqlData).query(query, function);
```
** This function is meant for advanced users familiar with MySQL.

#### Example Code

```javascript
const bot = require('@djs-premade/discordbot-premade');
bot.prefix = '#';
const p = bot.prefix;
bot.msgLogging = true;
bot.cmds([
  {
	  name: 'ping',
		usage: p+"ping",
		description: 'Get a bot response',
		callback: (message, args) => {
			message.channel.send('Pong!');
		}
	},
	{
		name: 'help',
		usage: p+"help",
		description: 'Get a list of commands',
		callback: (message, args) => {
	    message.channel.send(bot.helpCmd());
		}
	},
	{
	  name: 'say',
      permission: 'MANAGE_MESSAGES',
	  usage: p+"say",
	  description: 'Make the bot say something',
	  callback: (message, args) => {
	    message.channel.send(args.join(" "));
	  }
	},
  bot.premadeCmds[0] // Kick Command
]);
bot.setToken('<Bot Token>');
bot.ready();
```