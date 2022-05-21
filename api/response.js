module.exports=function responseResult(res,Message, statusCode=400,data) {
    // res.set('Content-Type','application/json')
    // console.log('typeof message', typeof Message)
    // console.log(' message', Message)
    res.status(statusCode)
    res.json({
        message: Message,
        info:data
    })

}
