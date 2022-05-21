const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');
const crypto = require('../model/crypto_model')
module.exports = async function (io) {
    function wait(delay) {
        return new Promise(res => setTimeout(() => res(), delay))
    }

    async function getDataFromPage(page, pageNum) {

        try {

            while (true) {
                const startTime = new Date().getTime();


                await page.goto(`https://coinmarketcap.com/?page=${pageNum + 1}`);

                await page.goto(`https://coinmarketcap.com/?page=${pageNum}`);
                console.log('page.url', page.url())
                console.log('pageNum', pageNum)
                await autoScroll(page);
                const trs = await page.$$('table.cmc-table > tbody > tr')
                let data = {info: [], error: []}
                for (let i = 0; i < trs.length; i++) {
                    try {

                        const coinNameDivElement = await trs[i].$('div.sc-16r8icm-0.sc-1teo54s-1.dNOTPP')
                        const coinAbsNameDivElement = await trs[i].$('div.sc-1teo54s-2')
                        const coinPriceDivElement = (await (await trs[i].$('div.sc-131di3y-0')).$('a'))
                        const name = await coinNameDivElement.$eval('p', x => x.innerText)
                        const abbreviation = await coinAbsNameDivElement.$eval('p', x => x.innerText)
                        const price = await coinPriceDivElement.$eval('span', x => x.innerText)
                        data.info.push({
                            abbreviation: abbreviation,
                            name: name,
                            price: price.replace(/[$,]/g, '')
                        })
                    } catch (e) {
                        data.error.push(`${i + 1} - ${e.message}`)
                        await wait(5000)
                        i = i - 1

                        // console.log(`some data miss at row ${i+1}}`,e)
                    }

                    // console.log('coinNameDivElement',await coinNameDivElement.$eval('p',x=>x.innerText))
                    // console.log('coinAbsNameDivElement',await coinAbsNameDivElement.$eval('p',x=>x.innerText))
                    // console.log('coinPriceDivElement',await coinPriceDivElement.$eval('span',x=>x.innerText))

                }
                // data.error=error
                const saveResult = await crypto.create(data)
                io.emit('crypto channel', data);
                console.log('saveResult', saveResult)
                const endTime = new Date().getTime();
                console.log(`Call ${1} page took ${endTime - startTime} milliseconds`)
            }

        } catch (err) {
            return err.message
        }

    }

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                window.scrollBy(0, 0);

                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 10);
            });
        });
    }

    const func = {
        getPriceFromWebsiteCheerio: async () => {
            const page = await axios({
                url: 'https://coinmarketcap.com/',
                method: 'get'
            })
            if (page.data) {

                const $ = await cheerio.load(page.data);

                const rowNum = $('table.cmc-table')
                    .children('tbody')
                    .children('tr').length
                setTimeout(() => {
                    for (let i = 0; i < rowNum; i++) {
                        console.log('urlCallResult', $('table.cmc-table')
                            .children('tbody')
                            .children('tr').eq(i)
                            .children('td').eq(2)
                            .children('div')
                            .children('a')
                            .children('div')
                            .children('div.sc-16r8icm-0')
                            .children('p').text()
                        )
                    }
                }, 10000)
            }

        },
        //for getting data from all pages
        getPriceFromWebsitePupeteer: async function () {
            // console.log( '$ 29,840.95'.replace(/[$,]/g,''))
            const pages = []
            const browser = await puppeteer.launch();
            for (let i = 0; i < 2; i++) {
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(60000000);
                pages.push(page)
            }
            console.log('pages', pages.length)


            await pages[0].goto('https://coinmarketcap.com/');
            const pageLi = await (await pages[0].$('div.sc-4r7b5t-3.bvcQcm')).$$('li')
            const lastPage = await pageLi[pageLi.length - 2].$eval('a', x => x.innerHTML)
            console.log('lastPage', lastPage)
            let allData = []
            let counter = 0
            while (true) {
                for (let i = 1; i <= 1; i++) {
                    // console.log('i',i)
                    if (counter == pages.length - 1) counter = 0
                    allData.push(getDataFromPage(pages[counter + 1], i))
                    counter++

                    if (allData.length == pages.length - 1) {
                        const startTime = new Date().getTime();
                        const result = await Promise.all(allData)
                        const endTime = new Date().getTime();
                        console.log('result', result)
                        console.log(`Call ${allData.length} page took ${endTime - startTime} milliseconds`)
                        allData = []
                    }

                }
            }
            //  const startTime = new Date().getTime();
            // const result= await  Promise.all(allData)
            //  const endTime = new Date().getTime();
            //  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
            // console.log('allData',allData)

            await browser.close();


        },
        //for one page
        getPriceFromWebsitePupeteer2: async function () {
            const browser = await puppeteer.launch();

            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(60000000);


            await page.goto('https://coinmarketcap.com/');
            const pageLi = await (await page.$('div.sc-4r7b5t-3.bvcQcm')).$$('li')
            const lastPage = await pageLi[pageLi.length - 2].$eval('a', x => x.innerHTML)
            console.log('lastPage', lastPage)


             await getDataFromPage(page, 1)

            await browser.close();


        },


    }

    await func.getPriceFromWebsitePupeteer2()

}
