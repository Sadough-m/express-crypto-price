const axios = require("axios");
const cheerio = require('cheerio');
module.exports={
    getCryptoInfo:async ()=>{
       const page= await axios({
            url: 'https://gadgets360.com/finance/crypto-currency-price-in-india-inr-compare-bitcoin-ether-dogecoin-ripple-litecoin',
            method: 'get'
        })
        const $ = cheerio.load(page.data);
        console.log('urlCallResult',$('div._flx crynm').innerText())

    }
}
