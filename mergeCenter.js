let swaggerDocument = require('./api/api.json');
let crypto = require("./service/crypto");

const lodash = require("lodash");

const api_spec=lodash.merge(
    swaggerDocument,
    crypto.schema,
)
module.exports={
    api_spec,
    app:(app)=>{
        app.use('/',crypto.routs)
        // app.use('',user_management.public.routs)
        // app.use('', passport.authenticate('jwt', { session: false }), user_management.admin.routs);
    },
    socket:{...crypto.socket}
}
