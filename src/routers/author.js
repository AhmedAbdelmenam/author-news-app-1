const express = require('express')
const Author = require('../models/author')
const router = new express.Router()
const auth = require('../middelware/auth')
const multer = require('multer')

router.post('/signUp', async(req, res) => {
    try {
        const author = new Author(req.body)
        await author.save()
        const token = await author.generateToken()
        res.status(200).send({ author, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/login', async(req, res) => {
    try {
        const author = await Author.findByCredentials(req.body.email, req.body.password)
        const token = await author.generateToken()
        res.status(200).send({ author, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/profile', auth.authorAuth, async(req, res) => {
    res.status(200).send(req.user)
})


router.get('/allAuthor', auth.authorAuth, auth.requiresAdmin, (req, res) => {
    Author.find({}).then((author) => {
        res.status(200).send(author)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

router.get('/author/:id', auth.authorAuth, auth.requiresAdmin, (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((author) => {
        console.log(author)
        if (!author) {
            return res.status(404).send('Unable to find user')
        }
        res.status(200).send(author)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

router.patch('/author/:id', auth.authorAuth, auth.requiresAdmin, async(req, res) => {
    try {
        const updates = Object.keys(req.body)

        const author = await Author.findById(req.params.id)

        if (!author) {
            return res.status(404).send('No user is found')
        }

        updates.forEach((el) => (user[el] = req.body[el]))
        await user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/author/:id', auth.authorAuth, auth.requiresAdmin, async(req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id)
        if (!author) {
            return res.status(404).send('No user is found')
        }
        res.status(200).send(author)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/logout', auth.authorAuth, async(req, res) => {
    try {

        req.author.tokens = req.author.tokens.filter((el) => {
            return el !== req.token
        })
        await req.author.save()
        res.send('Logout Successfully')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/logoutall', auth.authorAuth, async(req, res) => {
    try {
        req.author.tokens = []
        await req.author.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }

})

const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('Please upload image'))
        }
        cb(null, true)
    }
})

router.post('/profile/avatar', auth.authorAuth, uploads.single('avatar'), async(req, res) => {
    try {
        req.author.avatar = req.file.buffer
        await req.author.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})




module.exports = router