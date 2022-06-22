const express = require('express');
const { findAll } = require('../models/movie');
const router = express.Router();
const Movie = require('../models/movie');
const User = require('../models/user');
const Authmiddleware = require('../middleware/auth');

// 찜하기
router.put('/api/movie/:movieId/mylist', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Mylist']
    try {
        const { user } = res.locals;
        const id = req.params.movieId;
        const userlike = user.id;
        const movie = await Movie.findOne({ where: { id } });
        const mylistckeck = await movie.getLister({
            where: { id: user.id },
        });
        if (!mylistckeck.length) {
            await movie.addLister(userlike);
            return res.status(200).send({
                myList: true,
            });
        } else {
            await movie.removeLister(userlike);
            return res.status(200).send({
                myList: false,
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// 찜한 목록
router.get('/api/mylist', Authmiddleware, async (req, res, next) => {
    // #swagger.tags = ['Mylist']
    try {
        const { user } = res.locals;
        const id = user.id;
        const myuser = await User.findOne({
            where: { id },
            attributes: ['id'],
            include: { model: Movie, as: 'List' },
        });
        res.status(200).send(myuser);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
