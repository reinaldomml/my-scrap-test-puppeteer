import { scrapRobot } from './scrap-robot.js'
import chalk from 'chalk'

import express from 'express'
const app = express()
const PORT = process.env.NODE_PORT || 3000
const ENV = process.env.NODE_ENV || 'Development'

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.listen(PORT, (err) => {
    if (err) console.error('❌ Unable to connect the server: ', err)
    console.log(`✅ Server listening on port ${PORT} - ${ENV} environment`)
    console.log(`🌍 Navigate on url http://localhost:${PORT}`)
})

//Start the robot
scrapRobot()
