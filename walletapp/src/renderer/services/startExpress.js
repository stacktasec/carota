/* eslint-disable */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

function startExpress(walletService) {

    try {
        const app = express()
        app.walletService = walletService;
        app.use(cors())
        app.use(bodyParser.json());

        app.post('/evaluate', async function (req, res) {
            let channel = req.body.channel;
            let contract = req.body.contract;
            let func = req.body.func;
            let args = req.body.args;
            let result = await app.walletService.evaluateContract(channel, contract, func, ...args);
            res.json(result);
        })

        app.post('/submit', async function (req, res) {
            let channel = req.body.channel;
            let contract = req.body.contract;
            let func = req.body.func;
            let args = req.body.args;
            await app.walletService.submitContract(channel, contract, func, ...args);
            res.json()
        })

        console.log('The express is running.')
        const server = app.listen(3000)
        return server;

    } catch (err) {
        return null;
    }
}

export default startExpress;
