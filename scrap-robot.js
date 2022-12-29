/*-----------------------

# TODO: List of things to do before DEPLOY:
- [ ] Check: args: ['--no-sandbox', '--disable-setuid-sandbox']
- [ ]  Proxy - [https://www.bestproxyreviews.com/proxies-for-puppeteer/](https://www.bestproxyreviews.com/proxies-for-puppeteer/)
- [ ]  Install puppeteer-extra + stealth mode - Não perecer um BOT - [https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)

-----------------------*/

import config from './config.js'
import puppeteer from 'puppeteer'
import chalk from 'chalk'
import cron from 'node-cron'
import ora from 'ora'

// TIP: To simplify the code, sometimes we need to create a new function

// Simple time delay to continue the execution
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

async function searchForElements(page) {
    // Selectors for elements
    await page.waitForSelector('.form.form-inline')

    // Searching input
    await page.type('#q', config.SEARCH_TERM)
    await page.click('.btn.btn-primary')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
}

// Logic to define how many pages exist after the search
let pageCount = 0

async function getPageCount(page) {
    let itemsPerPage = await page.$$eval('ul.pagination li', (pageCount) => {
        if (pageCount.length < 1) {
            return pageCount.length + 1
        } else return pageCount.length - 1
    })
    console.log(chalk.green(` ===== Existem: ${chalk.red(itemsPerPage)} páginas ===== `))
    return (pageCount = itemsPerPage)
}

//TODO: Testar essa lógica no futuro, coletar N de páginas
// const lastPage = await page.$$eval(
//     'div[class*="pager"] > a > span[class*="page-numbers"]',
//     (spans) => {
//         return spans[spans.length - 2].textContent
//     },
// )
// console.log(lastPage)

// Logic to generate urls
let urls = []

async function getAllUrlsPages(page) {
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        await page.goto(config.URL + '?page_num=' + pageNum + '&q=' + config.SEARCH_TERM, {
            waitUntil: 'networkidle0',
        })

        console.log(
            chalk.yellow(' ===== Acessando página ' + pageNum + ' e salvando dados...' + ' ====='),
        )

        urls.push(page.url().toString())
    }
    return urls
}

/* -------------- Start the robot -------------- */

export async function scrapRobot() {
    /* then we can use the launch() method to create a browser instance: */
    const browser = await puppeteer.launch({
        headless: true, // set it false to see chrome
        defaultViewport: null,
        args: ['--start-maximized', '--disable-dev-shm-usage'],
    })

    /* Definindo Array com URLs abertas no Browser, começando com 0 */
    const page = (await browser.pages())[0]

    /* TODO: Check this on the future */
    /* Use localhost and connect to execute Chrome away from our codebase */

    // const browser = new PuppeteerHelper(
    //     await puppeteer.connect({
    //         browserWSEndpoint: 'ws://localhost:3000',
    //         headless: true, // set it false to see chrome
    //         defaultViewport: null,
    //         args: ['--start-maximized', '--disable-dev-shm-usage'],
    //     }),
    // )

    // Launch a loading using ora package
    const spinner = ora({
        color: 'blue',
        hideCursor: false,
        interval: 80,
    }).start()

    console.log(chalk.green(' ===== Browser Opening... 🌍 ===== '))
    spinner.succeed('Browser opened')
    await delay(0)

    console.log(chalk.green(` ===== Indo para a página: ${chalk.underline(config.URL)}  ===== `))
    spinner.info('Page opened')
    await delay(0)

    /* Accessing the main page */
    await page.goto(config.URL)

    console.log(chalk.yellow(' ===== Buscando novos dados ===== '))
    await searchForElements(page)
    spinner.info('Searching for elements')
    await delay(0)

    console.log(chalk.yellow(' ===== Verificando quantas páginas disponíveis ===== '))
    await getPageCount(page)
    spinner.info('Getting page count')
    await delay(0)

    console.log(chalk.yellow(' ===== Recebendo novos links da busca ===== '))
    await getAllUrlsPages(page)
    spinner.info('Getting all urls')
    await delay(0)

    console.log(chalk.yellow(' ===== Coletando dados ===== '))
    spinner.succeed('Collecting data')
    // Create another fuction?
    await delay(0)

    // Open new pages and push data from all new urls

    let dataFromUrls = []

    for (let i = 0; i < urls.length; i++) {
        let url = urls[i]
        console.log(`Coletando dados da url: ${chalk.underline(url)}`)

        /* --- Logic to collect data for each url --- */
        await page.goto(url, { waitUntil: 'networkidle0' })
        let data = await page.evaluate(async () => {
            const root = Array.from(document.querySelectorAll('tr.team'))
            let elements = root.map((e) => ({
                id:
                    Date.now().toString(36) +
                    Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(
                        36,
                    ),
                date: new Date().toLocaleDateString(),
                // Below data collected from the page in const root
                teamName: e.querySelector('td.name').innerText,
                wins: e.querySelector('td.wins').innerText,
                loses: e.querySelector('td.losses').innerText,
            }))
            return elements // Return the data from page.evaluate
        })
        dataFromUrls.push(...data) // Push data from each page to dataFromUrls
    }

    console.log(chalk.green(' ===== Todos os dados coletados  ===== '))
    console.log(dataFromUrls)
    console.log(
        chalk.green(' ===== Total de ' + dataFromUrls.length + ' ✅ dados coletados ===== '),
    )
    await delay(0)

    await browser.close()
    console.log(chalk.red(' ===== Browser closed ❌ ===== '))
}
