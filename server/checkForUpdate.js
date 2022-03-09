const {refreshUser } = require('./logic');
const User = require('./src/database/models/user');

async function checkForUpdate() {
    const id = parseInt(require('fs').readFileSync('last.txt', 'utf-8'))
    const promise = await new Promise(async (resolve, reject) => {
        try {
            const users = await User.findAll({order: [['id', 'ASC']]});
            let start = new Date().getTime();
            for (const user of users) {
                if (user.id < id)
                    continue;
                console.log(user.username)
                await refreshUser(user.puuid)
                require('fs').writeFileSync('last.txt', user.id.toString() ,{
                    encoding: 'utf-8'
                })
            }
        } catch (error) {
            console.log(error);
        }
        resolve()
    })
    checkForUpdate()
}

checkForUpdate();