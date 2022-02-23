const express = require('express')
const Task = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')

// post

router.post('/news', auth.authorAuth, async(req, res) => {
    try {
        // const task = new Task(req.body)
        // spread operator --> copy of data
        const news = new News({...req.body, owner: req.news._id })
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get all

router.get('/allNews', auth.authorAuth, auth.requiresAdmin, async(req, res) => {
    try {
        const news = await News.find({})
        res.send(news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

///////////////////////////////////////////////////////////////////////////

// get of user tasks
router.get('/news', auth.authorAuth, async(req, res) => {
    try {
        await req.author.populate('news')
        res.send(req.author.news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

/////////////////////////////////////////////////////////////////////////////////

// get by id
// version 1 findById only 
// router.get('/tasks/:id',auth,async(req,res)=>{
//     const id = req.params.id
//     try{
//         const task = await Task.findById(id)
//         if(!task){
//             return res.status(404).send('No task is found')
//         }
//         res.status(200).send(task)
//     }
//     catch(e){
//         res.status(500).send(e.message)
//     }
// })
////////////////////////////////////////////////////////////////////////////


// version2 

router.get('/news/:id', auth.authorAuth, async(req, res) => {
        const _id = req.params.id
        try {
            // 6211ebdd7f53cc8c3db89a0e , 6211eb967f53cc8c3db89a07
            // 6211ec367f53cc8c3db89a11 , 6211eb967f53cc8c3db89a07
            const news = await News.findOne({ _id, owner: req.author._id })
            if (!news) {
                return res.status(404).send('No task is found')
            }
            res.status(200).send(news)
        } catch (e) {
            res.status(500).send(e.message)
        }
    })
    /////////////////////////////////////////////////////////////////////////////
    // patch 
router.patch('/news/:id', auth.authorAuth, async(req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOneAndUpdate({ _id, owner: req.author._id }, req.body, {
            new: true,
            runValidators: true
        })
        if (!news) {
            return res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// delete

router.delete('/news/:id', auth.authorAuth, async(req, res) => {
    try {
        const _id = req.params.id
        const news = await Task.findOneAndDelete({ _id, owner: req.author._id })
        if (!news) {
            return res.status(404).send('No task is found')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//////////////////////////////////////////////////////////////////////////////

router.get('/userNews/:id', auth.authorAuth, async(req, res) => {
    try {
        const _id = req.params.id
        const news = await Task.findOne({ _id, owner: req.author._id })
        if (!news) {
            return res.status(404).send('No task is found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


module.exports = router