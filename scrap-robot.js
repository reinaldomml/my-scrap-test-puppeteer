/*-----------------------

# TODO: List of things to do before DEPLOY:
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

    //FIXME: Apagar isso depois
    // Checando quantas páginas temos
    // let pageCount = (await page.$$eval('ul.pagination li').length) - 2
}

// Lógica para coletar quantas páginas existem

let pageCount = 0

async function getPageCount(page) {
    // let pageCount = await page.$$eval('ul.pagination li', (itemsPerPage) => {
    //     return itemsPerPage.length - 1
    // })
    let itemsPerPage = await page.$$eval('ul.pagination li', (pageCount) => {
        return pageCount.length - 1
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

async function getAllUrlsPages(page) {
    let urls = []
    // console.log(pageCount) ////////DEBUG
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        await page.goto(config.URL + '?page_num=' + pageNum + '&q=' + config.SEARCH_TERM, {
            waitUntil: 'networkidle0',
        })

        console.log(
            chalk.yellow(' ===== Acessando página ' + pageNum + ' e salvando dados...' + ' ====='),
        )

        urls.push({ url: page.url().toString() })
        console.log(urls)
    }
    return urls
}

/* ------- Start the robot ------- */

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

    console.log(chalk.green(' ===== Abrindo browser ===== '))
    await delay(0)

    console.log(chalk.green(` ===== Indo para a página: ${chalk.underline(config.URL)}  ===== `))
    await delay(0)

    /* Acessando a página principal */
    await page.goto(config.URL)

    /* Run javascript inside the page */
    console.log(chalk.yellow(' ===== Buscando novos dados ===== '))
    await searchForElements(page)
    await delay(0)

    console.log(chalk.yellow(' ===== Verificando quantas páginas disponíveis ===== '))
    await getPageCount(page)
    await delay(0)

    console.log(chalk.yellow(' ===== Recebendo novos links da busca ===== '))
    await getAllUrlsPages(page)
    await delay(0)

    // TODO: Open new pages and push all new urls

    /* Referência */
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

    // console.log(data)

    await browser.close()
}
