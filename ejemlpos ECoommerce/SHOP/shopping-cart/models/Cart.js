import mongoose from "mongoose";
const item = new mongoose.Schema({
    productId:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    }
})
const Cart = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    products:{
        type:[item],
        default:[]
    }
})

export default mongoose.model("Cart", Cart);