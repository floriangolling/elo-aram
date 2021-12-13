const express = require('express')
const userRouter = express.Router();
const leagueController = require('../controllers/league-api')
const User = require('../database/models/user');
const UserMatch = require('../database/models/user_match');
const Match = require('../database/models/match');

userRouter.get('/champion/:champion/:name', async (req, res, next) => {
    try {
        const user = User.findOne({where: {username: req.params.name}})
        const userMatch = UserMatch.findAll({where: {}})
        console.log(user)
    } catch (error) {
        console.log(error);
    }
})


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