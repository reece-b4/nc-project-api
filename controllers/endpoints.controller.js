const endpoints = require('../endpoints.json')

exports.getEndpointsInfo = (req, res, next) => {
    res.status(200).send({endpoints})
}