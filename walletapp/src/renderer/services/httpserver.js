/* eslint-disable */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const originalLogs = []

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

            try {
                let result = await app.walletService.evaluateContract(channel, contract, func, ...args);
                res.json({ result });
                writeLogSuccess(channel, contract, func)

            } catch (error) {
                res.status(400).json({ errMsg: error.message })
                writeLogFailed(channel, contract, func, error.message)
            }
        })

        app.post('/submit', async function (req, res) {

            let channel = req.body.channel;
            let contract = req.body.contract;
            let func = req.body.func;
            let args = req.body.args;

            try {
                await app.walletService.submitContract(channel, contract, func, ...args);
                res.json()
                writeLogSuccess(channel, contract, func)
            } catch (error) {
                res.status(400).json({ errMsg: error.message })
                writeLogFailed(channel, contract, func, error.message)
            }
        })

        console.log('The express is running.')
        const server = app.listen(3000)
        return server;

    } catch (err) {
        return null;
    }
}

function writeLogSuccess(channel, contract, func) {
    let msg = `channel:"${channel}",contract:"${contract}",function:"${func}".`;
    originalLogs.push({ type: 1, msg })
}

function writeLogFailed(channel, contract, func, errMsg) {
    let msg = `channel:"${channel}",contract:"${contract}",function:"${func}".error:"${errMsg}"`;
    originalLogs.push({ type: 0, msg })
}

export { startExpress, originalLogs };
