/* eslint-disable */

import express from 'express'
import cors from 'cors'
import connectToNetwork from '../services/connectToNetwork'

function startExpress(){
    const app = express()
    app.use(cors())
    
    app.get('/', async function (req, res) {
        let jr = await connectToNetwork();
        res.json(jr)
    })
    
    console.log('The express is running.')
    app.listen(3000)
}

export default startExpress;
