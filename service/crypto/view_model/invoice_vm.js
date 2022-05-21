const Invoice = require("../model/crypto_model");

module.exports={
    find_user_invoices:async (userObj)=>{
        console.log('userObj',userObj)
        let temp={
            user:userObj,
            invoices:await Invoice.find({user_obj_id:userObj._id})
        }
        console.log('find obj',temp)
        // if(!!temp.invoices)  throw 'موردی یافت نشد'
        return temp
    }
}
