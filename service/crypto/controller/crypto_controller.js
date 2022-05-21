// const repo = require('@dataBase/repository')
// const validator = require('../validator_model/schema')
const response =require('../../../api/response')
const express =require('express')
const Price = require('../model/crypto_model');


const router =express.Router()
router.get('/crypto_price', async(req, res)=>{
try {
    console.log('invoice_create req',req.body)
    // let product=await Product.findById(req.body.product_obj_id)
    // // console.log('product',product)
    // // req.body.effected_date=jalali(req.body.effected_date,'YYYY/MM/DD').locale('en')
    // req.body.effected_date=jalali.from(req.body.effected_date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD'); // 1989/01/24
    //
    // console.log('req.body.effected_date',req.body.effected_date)
    // const model = new Price({
    //     ...req.body,
    //     price:0
    // });
    //
    // const result = await model.save();
    // console.log(result);
    response(res,'با موفقیت انجام شد',200,{})
}catch (err){
response(res,'خطا',400,err)
}
    // response(res,'Hello world!',200)
    // res.send("Hello world!");
});

const socket={
    receiveCryptoData:(socket,io)=>{
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('crypto channel', (msg) => {
            console.log('message: ' + msg);

        });
    }
}




module.exports={
    schema:require('../validator_model/invoice_schema.json'),
    routs:router,
    socket:socket
    }


