import config from './config.js'
import puppeteer from 'puppeteer'
import chalk from 'chalk'

// Delay to continue the execution
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

// then we can use the launch() method to create a browser instance:
export async function scrapUrl() {
    const browser = await puppeteer.launch({
        headless: true, // set it false to see chrome
        defaultViewport: null,
        args: ['--start-maximized', '--disable-dev-shm-usage'],
    })
    console.log('Abrindo browser..')
    await delay(2000)

    const page = await browser.newPage()

    console.log('Indo para a página... ' + config.URL)
    await delay(2000)

    await page.goto(config.URL)

    /* Run javascript inside the page */
    console.log(chalk.red(' ===== Acessando elementos na página ===== '))
    await delay(2000)

    const data = await page.evaluate(() => {
        const books = document.querySelectorAll('article.product_pod')
        const data = []
        books.forEach((book) => {
            const title = book.querySelector('h3 > a').getAttribute('title')
            const price = book.querySelector('.price_color').innerText
            data.push({ title, price })
        })
        return data
    })

    console.log(data)
    await browser.close()
}
