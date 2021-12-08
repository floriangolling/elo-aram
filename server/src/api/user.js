const express = require('express')
const userRouter = express.Router();
const leagueController = require('../controllers/league-api')
const User = require('../database/models/user');


userRouter.get('/:name', async(req, res) => {
    const {name} = req.params;
    try {
        if (!name)
            return res.status(400).send({message: "not a valid name"})
        const puuid = await leagueController.userController.getUserPUUIDByNameEUW(name)
        let user = await User.findOne({where: {puuid: puuid}});
        if (!user)
            user = await User.create({puuid: puuid, username: name})
        return res.status(200).send({winrate: user.winrate, username: user.username, elo: user.elo, games: user.games, wins: user.wins});
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = userRouter;