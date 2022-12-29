import { scrapRobot } from './scrap-robot.js'
import chalk from 'chalk'
import cron from 'node-cron'
import ora from 'ora'

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

/* ---------------------------- Start ---------------------------- */

// Schedule tasks to be run on the server.
// To help with time: https://crontab.guru/

// Start cronJob to execute robot: every minute
cron.schedule(
    '*/1 * * * *',
    function () {
        console.log(chalk.yellow(' ===== Running Robot 🤖 + Cron Job ⌛ ===== '))
        /* ---- Tasks ---- */
        //Start the robot 01
        scrapRobot()
        /* ---- End ---- */
        // Log the time
        console.log(
            chalk.cyan(
                ` ===== Task RUN in: ${chalk.underline(new Date().toLocaleString())} 🔄  ===== `,
            ),
        )
        console.log(chalk.cyan(` ===== Next task in: ${chalk.underline('FALTA AQUI')} 🔄  ===== `))
    },
    {
        scheduled: true,
        timezone: 'Europe/Amsterdam',
    },
)
