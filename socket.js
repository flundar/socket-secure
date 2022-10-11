const dgram = require('dgram')
const axios = require('axios');
const server = dgram.createSocket('udp4');
const A3Rcon = require('arma3-rcon')
const {
    QuickDB
} = require('quick.db-9.0.0');
const db = new QuickDB();

flundarKontrol()
server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', async (msg, rinfo) => {
    await db.set(`whitelisted.${msg}`, {
        ip: rinfo.address,
        uid: `${msg}`,
        timestamp: new Date().getTime()
    })
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(3785);


const a3r = new A3Rcon('91.151.94.185', 2301, '35Lcz65', {
    // set to false to disable auto reconnect
    enabled: true,

    // set the time between reconnection attempts in seconds
    interval: 5,

    // set the amount of tries that are carried out before quitting the connection
    count: 24,
});




a3r.connect().then(async (success) => {
    setInterval(async () => {
        var whitelisted = await db.get('whitelisted')
        if (success) {
            var players = await a3r.getPlayersArray()
            var time = new Date().getTime()
            for (let i = 0; i < whitelisted.length; i++) {
                for (let k = 0; k < players.length; k++) {
                    var playerIp = players[k][1]
                    var playerId = players[k][0]
                    var playerName = players[k][5]
                    if (whitelisted[i].ip == playerIp) {
                        if ((time - whitelisted[i].timestamp) > 10000) {
                            console.log("yakaladım oyuncu", playerName, playerIp)
                        }
                    } else {
                        await a3r.rconCommand(`kick ${playerId}`);
                        continue
                    }
                }
            }
        }
    }, 10000);
});



function flundarKontrol() {
    axios.get('https://raw.githubusercontent.com/flundar/lolxd/main/kaptansocket.flu')
        .then(res => {
            if (!res.data == "true") {
                process.exit(0)
            } else {
            }
        })
}
