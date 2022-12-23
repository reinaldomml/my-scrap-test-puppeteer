/*-----------------------
# TODO: List of things to do:
- [ ] Check: args: ['--no-sandbox', '--disable-setuid-sandbox']
- [ ]  Proxy - [https://www.bestproxyreviews.com/proxies-for-puppeteer/](https://www.bestproxyreviews.com/proxies-for-puppeteer/)
- [ ]  Install puppeteer-extra + stealth mode - Não perecer um BOT - [https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)
-----------------------*/

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

async function getAllUrlsPages(page) {
    const urls = []

    // Push current urls element from page
    const hrefs = await page.waitForSelector('ul.pagination li')
    // FIXME: Push all urls from page
    // urls.push({ hrefs }.tostring())

    console.log(chalk.greenBright(hrefs))

    // FIXME: Open new pages and push all new urls
}

/* --- Start the robot --- */

export async function scrapRobot() {
    /* then we can use the launch() method to create a browser instance: */

    const browser = await puppeteer.launch({
        headless: true, // set it false to see chrome
        defaultViewport: null,
        args: ['--start-maximized', '--disable-dev-shm-usage'],
    })

    /* FIXME: Check this on the future */
    /* Use localhost and connect to execute Chrome away from our codebase */

    // const browser = new PuppeteerHelper(
    //     await puppeteer.connect({
    //         browserWSEndpoint: 'ws://localhost:3000',
    //         headless: true, // set it false to see chrome
    //         defaultViewport: null,
    //         args: ['--start-maximized', '--disable-dev-shm-usage'],
    //     }),
    // )

    console.log(chalk.green(' ===== Abrindo browser ===== '))
    await delay(0)

    console.log(chalk.green(' ===== Indo para a página -> ' + config.URL + '  ===== '))
    await delay(0)

    /* Definindo Array com URLs abertas no Browser, começando com 0 */
    const page = (await browser.pages())[0]

    /* Acessando a página principal */
    await page.goto(config.URL)

    /* Run javascript inside the page */
    console.log(chalk.yellow(' ===== Buscando novos elementos ===== '))
    await searchForElements(page)
    await delay(0)

    console.log(chalk.yellow(' ===== Recebendo novos links da busca ===== '))
    await getAllUrlsPages(page)
    await delay(0)

    // const data = await page.evaluate(() => {
    //     const elements = document.querySelectorAll('tr.team')
    //     const data = []
    //     elements.forEach((e) => {
    //         const teamName = e.querySelector('td.name').innerText
    //         const wins = e.querySelector('td.wins').innerText
    //         const loses = e.querySelector('td.losses').innerText
    //         data.push({ teamName, wins, loses })
    //     })
    //     return data
    // })

    /* Options */
    // console.log(data)
    // console.log(chalk.blue(urls))
    await browser.close()
}
