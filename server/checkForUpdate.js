const {refreshUser } = require('./logic');
const User = require('./src/database/models/user');
const {parentPort} = require('worker_threads');
const leagueController = require('./src/controllers/league-api');
let VIP = [];

async function checkForUpdate() {
    parentPort.on("message", message => {
        VIP.push(message.name);
    });
    const promise = await new Promise(async (resolve, reject) => {
        try {
	    let id = 1;
            let start = new Date().getTime();
            for (;;) {
		if (id > 2000000)
			id = 1;
		console.log('vip', VIP);
                if (VIP.length !== 0) {
		    const vipName = VIP.pop().toLowerCase();
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
		const user = await User.findOne({where: {id}});
                console.log(user.username);
                await refreshUser(user.puuid);
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
