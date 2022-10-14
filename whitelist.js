const axios = require('axios');
const {
    QuickDB
} = require('quick.db-9.0.0');
const db = new QuickDB();
const readline = require('readline-sync');
flundarKontrol()


function flundarKontrol() {
    axios.get('https://raw.githubusercontent.com/flundar/lolxd/main/kaptansocket.flu')
        .then(res => {
            var owner = res.data.split(';')[0];
            var lisans = res.data.split(';')[1];
            var durum = res.data.split(';')[1];
            if (!durum == "true") {
                process.exit(0)
            } else {
                console.log(`Hoşgeldin ${owner}, ${lisans} ${durum}.`)
                console.log(`İyi kullanımlar...`)
            }
        })
}

var userinput = 0;
userinput = readline.question(`IP Adresi:\n`);

await db.set(`whitelisted.${userinput.replace(/\./g,"")}`, {
    uid: `null`,
    ip: `null`,
    timestamp: 1760435887
})

process.exit(0)
