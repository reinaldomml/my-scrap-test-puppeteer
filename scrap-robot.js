import config from './config.js'
import puppeteer from 'puppeteer'
import chalk from 'chalk'

// Simple Delay to continue the execution
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

async function searchForElements(page) {
    // Selectors for elements
    await page.waitForSelector('.form.form-inline')

    // As vezes é necessário criar uma função externa

    // Informações de busca
    await page.type('#q', config.SEARCH_TERM)
    await page.click('.btn.btn-primary')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
}

/* Start the robot */

// then we can use the launch() method to create a browser instance:
export async function scrapRobot() {
    const browser = await puppeteer.launch({
        headless: true, // set it false to see chrome
        defaultViewport: null,
        args: ['--start-maximized', '--disable-dev-shm-usage'],
    })
    console.log('Abrindo browser..')
    await delay(1000)

    console.log('Indo para a página... ' + config.URL)
    await delay(1000)

    /* Definindo Array com URLs abertas no Browser, começando com 0 */
    const page = (await browser.pages())[0]

    /* Acessando a página principal */
    await page.goto(config.URL)

    /* Run javascript inside the page */
    console.log(chalk.red(' ===== Buscando novos elementos ===== '))
    await searchForElements(page)
    await delay(1000)

    const data = await page.evaluate(() => {
        const elements = document.querySelectorAll('tr.team')
        const data = []
        elements.forEach((e) => {
            const teamName = e.querySelector('td.name').innerText
            const wins = e.querySelector('td.wins').innerText
            const loses = e.querySelector('td.losses').innerText
            data.push({ teamName, wins, loses })
        })
        return data
    })

    console.log(data)
    await browser.close()
}
