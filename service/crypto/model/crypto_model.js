const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    // product_obj_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Product',
    //     required: true
    // },
    // user_obj_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'User',
    //     required: true
    // },

    info: {

            type: Array,
            required: true

    },
    error:{
        type: Array,
        required: false
    }

},{ collection: 'price',timestamps: true});

// UserSchema.pre(
//     'save',
//     async function(next) {
//         const user = this;
//         const hash = await bcrypt.hash(this.password, 10);
//
//         this.password = hash;
//         next();
//     }
// );

// InvoiceSchema.methods.createInvoice = async function(obj) {
//     const user = this;
//     // const compare = await bcrypt.compare(password, user.password);
//     // return compare;
// }
const Model = mongoose.model('Price', InvoiceSchema);

module.exports = Model;
