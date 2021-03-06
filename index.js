const Discord = require('discord.js');
const client = new Discord.Client();
const colors = require('colors');
var token = '';

module.exports.prefix = '!';
module.exports.embedColor = 'RANDOM';

module.exports.msgLogging = false;
module.exports.commands = [];

module.exports.client = client;

module.exports.setPrefix = (p) => {
  this.prefix
}
module.exports.cmds = (newCmds) => {
  this.commands = newCmds
}

module.exports.client = client;

client.on('message', message => {
  const {
    author,
    content,
    channel
  } = message;
  let msg = message

  // Check if message author is the bot
  if (author.bot) {
    if (author.id != client.user.id && this.msgLogging) {
      console.log(`[Message] ${author.username}:`.green + ` ${content}`);
    }
    return;
  }
  if (this.msgLogging)
    console.log(`[Command] ${author.username}:`.green + ` ${content}`);

  // Split message arguments
  const ar = message.content.split(/[ ]+/);
  // Delete the "!command"
  ar.shift()
  for (var i = 0; i < this.commands.length; i++) {
    if (this.commands[i].prefix === undefined) {
      this.commands[i].prefix = true;
    }
    // If Command Does Not Require Prefix
    if (this.commands[i].prefix === false) {
      if (message.content.split(" ")[0] == `${this.commands[i].name}`) {
        if (this.commands[i].permission != undefined) {
          if (!message.member.hasPermission(this.commands[i].permission)) return msg.reply("You do not have permission to use this command")
        }
        // Execute function inside command
        this.commands[i].callback(message, ar);
        return
      }
      return
    }
    // If command has 2 or more names
    if (Array.isArray(this.commands[i].name)) {
      for (let i2 = 0; i2 < this.commands[i2].name.length; i2++) {
        if (message.content.split(" ")[0] == `${this.prefix}${this.commands[i].name[i2]}`) {
          if (this.commands[i].permission != undefined) {
            if (!message.member.hasPermission(this.commands[i].permission)) return msg.reply("You do not have permission to use this command")
          }
          try {
            // Executes function inside command
            this.commands[i].callback(message, ar);
          } catch (e) {
            console.log(`${e}`.red)
          }
          return
        }
      }
    }

    // If its a normal command
    if (message.content.split(" ")[0] == `${this.prefix}${this.commands[i].name}`) {
      if (this.commands[i].permission != undefined) {
        if (!message.member.hasPermission(this.commands[i].permission)) return msg.reply("You do not have permission to use this command")
      }
      try {
        this.commands[i].callback(message, ar);
      } catch (e) {
        console.log(`${e}`.red)
      }
      return
    }
  }
  console.log(`Command "${message.content.split(" ")[0].substr(1)}" not found`.red)
});

module.exports.setToken = t => {
  token = t;
};

module.exports.ready = func => {
  if (token == '') {
    console.log(
      'Error:'.red +
      ' You need to set the bot token, you can do this by executing: ' +
      "bot.setToken('<token goes here>')".red
    );
    return;
  }
  client.login(token)
  console.log('Bot online!'.green);
  switch (func) {
    case undefined:
      break;
    default:
      client.once('ready', func);
  }
};
module.exports.helpCmd = () => {
  var emb = new Discord.MessageEmbed()
    .setTitle('Help')
    .setColor(this.embedColor)
    .setDescription('**Prefix:** ' + this.prefix);

  for (var i = 0; i < this.commands.length; i++) {
    var firstlet = this.commands[i].name.substr(0, 1).toUpperCase(); // Sets first letter to capital
    var lastLet = this.commands[i].name.substr(1); // Trims the first letter
    emb.addField(
      firstlet + lastLet + ` - ${this.commands[i].description}`,
      this.commands[i].usage
    );
  }
  return emb;
};

module.exports.message = func => {
  client.on('message', func);
};

module.exports.mysql = (data) => {
  const sql = require("mysql");
  var connection = sql.createConnection(data);
  connection.connect((e) => {
    if (e) {
      console.log("MySQL Error:".red + "\n" + e);
      return;
    }
  });
  return {
    createTable: (name, data) => {
      connection.query(`CREATE TABLE IF NOT EXISTS ${name} ${data}`);
    },
    insertInto: (table, column, data) => {
      connection.query(`INSERT IGNORE INTO ${table} (${column}) VALUES (${data})`);
    },
    delete: (table, column, data) => {
      connection.query(`DELETE FROM ${table} WHERE ${column} = '${data}'`)
    },
    query: (q, f) => {
      switch (f) {
        case undefined:
          connection.query(q)
        default:
          connection.query(q, f)
      }

    },
    findOneAndUpdate: (data, callback) => {
      connection.query(`SELECT * FROM ${data.table} WHERE ${data.findCol}='${data.findColVal}'`, (err, rows) => {
        if (err) throw err

        if (rows.length <= 0) {
          connection.query(`INSERT IGNORE INTO ${data.table} (${data.column}) VALUES (${data.newVal})`)
          return
        }
        rows.forEach(r => {
          connection.query(`UPDATE ${data.table} SET ${data.column}='${data.newVal}' WHERE ${data.findCol}='${data.findColVal}'`)
          switch (callback) {
            case undefined:
              break;
            default:
              callback(r)
          }
        })


      })
    },
    findTwoAndUpdate: (data, callback) => {
      connection.query(`SELECT * FROM ${data.table} WHERE ${data.findCol}='${data.findColVal}' AND ${data.find2Col}='${data.find2ColVal}'`, (err, rows) => {
        if (err) throw err

        if (rows.length <= 0) {
          connection.query(`INSERT IGNORE INTO ${data.table} (${data.column}) VALUES (${data.newVal})`)
          return
        }
        rows.forEach(r => {
          connection.query(`UPDATE ${data.table} SET ${data.column}='${data.newVal}' WHERE ${data.findCol}='${data.findColVal}' AND ${data.find2Col}='${data.find2ColVal}'`)
          switch (callback) {
            case undefined:
              break;
            default:
              callback(r)
          }
        })

      })
    }
  };
};
const path = require('path')
const fs = require('fs')
module.exports.commandsFolder = (dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir)) // Reads the directory
  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file)) // Gets data of the file
    console.log(`Loaded command: ${file.substr(0,file.length-3)}`.blue)

    if (stat.isDirectory()) { // If folder passed has another folder it will read commands in that folder aswell
      this.commandsFolder(path.join(dir, file))
    }
  }
  for (var i = 0; i < files.length; i++) {
    this.commands.push(require(`${path.join(__dirname,dir,files[i])}`)) // Just pushes { require('command.js'); }, into command array
  }
}
