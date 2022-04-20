const {refreshUser } = require('./logic');
const User = require('./src/database/models/user');
const {parentPort} = require('worker_threads');
const leagueController = require('./src/controllers/league-api');
let VIP = [];

async function checkForUpdate() {
    parentPort.on("message", message => {
        VIP.push(message.name);
    });
    let id = parseInt(require('fs').readFileSync('last.txt', 'utf-8'))
    const promise = await new Promise(async (resolve, reject) => {
        try {
            let start = new Date().getTime();
            for (;;) {
                const user = await User.findOne({where: {id}});
                if (user.id < id)
                    continue;
                if (VIP.length !== 0) {
		    const vipName = VIP.pop();
                    let VIPUSER = await User.findOne({where: { username: vipName }});
                    if (VIPUSER) {
                        console.log(VIPUSER.username);
                        await refreshUser(VIPUSER.puuid)
                    } else {
			const vipUserPuuid = await leagueController.matchController.getUserPUUIDByNameEUW(vipName);
                        VIPUSER = await User.findOne({where: {puuid: vipUserPuuid}});
                        if (!VIPUSER) {
				VIPUSER = await User.create({ username: vipName, puuid: vipUserPuuid});
			} else {
				VIPUSER.set({username: vipName});
				await VIPUSER.save();
			}
			await refreshUser(VIPUSER.puuid);
			}
                    continue;
                }
                console.log(user.username);
                await refreshUser(user.puuid)
                require('fs').writeFileSync('last.txt', user.id.toString() ,{
                    encoding: 'utf-8'
                })
		id++;
            }
        } catch (error) {
            console.log(error);
        }
        resolve()
    })
    checkForUpdate()
}

checkForUpdate();
