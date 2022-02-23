const jwt = require('jsonwebtoken')
const Author = require('../models/author')
const authorAuth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        const author = await Author.findOne({ _id: decode._id, tokens: token })
        if (!author) {
            throw new Error()
        }
        req.author = author
        req.token = token

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate' })
    }
}

const requiresAdmin = async(req, res, next) => {
    if (req.author.roles !== 'admin') {
        return res.status(401).send({ error: 'You are not admin' })
    }
    next()
}

module.exports = {
    authorAuth,
    requiresAdmin
}