import { Types } from "mongoose";
import { createRecord, deleteRecord, getAllRecord, getRecord, updateRecord } from "../common/common_database_queries.js";
import GyroCartModel from "../models/gyro_cart_schema.model.js";
import GyroCheckoutModel from "../models/gyro_checkout_schema.model.js";
import GyroProductsModel from "../models/gyro_products_schema.model.js";
import GyroUserModel from "../models/gyro_user_schema.model.js";

const getProductsList = async (req, res) => {
    try {
        const { createdAt, name, category, quantity, price, sort, limit = 50, page = 1 } = req.query;
        const filters = {isAvailable:true};  
        if (createdAt) {
            const [startDate, endDate] = createdAt.split(',');
            filters.createdAt = {
                ...(startDate ? { $gte: new Date(startDate) } : {}),
                ...(endDate ? { $lte: new Date(endDate) } : {}),
            };
        }
        if (name) {
            filters.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filters.category = { $regex: category, $options: 'i' };
        }
        if (quantity) {
            const [minQuantity, maxQuantity] = quantity.split(',');
            filters.quantity = {
                ...(minQuantity ? { $gte: parseInt(minQuantity, 10) } : {}),
                ...(maxQuantity ? { $lte: parseInt(maxQuantity, 10) } : {}),
            };
        }
        if (price) {
            const [minPrice, maxPrice] = price.split(',');
            filters.price = {
                ...(minPrice ? { $gte: parseFloat(minPrice) } : {}),
                ...(maxPrice ? { $lte: parseFloat(maxPrice) } : {}),
            };
        }
    
        const sortOptions = sort ? sort.split(',').join(' ') : '-createdAt';
        const resultsLimit = parseInt(limit, 10) || 50;
        const currentPage = parseInt(page, 10) || 1;
        const skip = (currentPage - 1) * resultsLimit;
    
        const [products, count] = await Promise.all([
            GyroProductsModel.find(filters).sort(sortOptions).skip(skip).limit(resultsLimit),
            GyroProductsModel.countDocuments(filters),
        ]);
    
        const totalPages = Math.ceil(count / resultsLimit);
    
        res.status(200).json({
            message: "Products list fetched successfully",
            status: true,
            count: products.length,
            currentPage,
            totalPages,
            limit: resultsLimit,
            products,
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};


const addProductToCart = async (req, res) => {
    const { user_id , product_id , quantity , special_note , add_ons } = req.body;
    try {
        if( quantity < 0 ){
            return res.status(400).json({ message: "Quantity should be greater than 0" });
        }
        const cart = await getRecord(GyroCartModel, { user_id , product_id });
        const cartObj = {
            user_id: user_id,
            product_id: product_id,
            quantity: quantity,
            special_note: special_note,
            add_ons: add_ons
        }
        if (cart.status===false) {
            const product = await getRecord(GyroProductsModel, { _id: product_id });
            if (product.status===false) {
                return res.status(400).json({ message: "Product not found" });
            }
            let newProduct = await createRecord(GyroCartModel, cartObj);
            res.status(200).json({
                message: "Product added to cart successfully",
                status: true,
                count: newProduct.data.length,
                product: newProduct.data
            });
        } else {
            let updateProduct = await updateRecord(GyroCartModel, { user_id , product_id }, { $inc: { quantity: 1 } });
            res.status(200).json({
                message: "Product added to cart successfully",
                status: true,
                count: updateProduct.data.length,
                product: updateProduct.data
            });
        }
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await getRecord(GyroCartModel, { _id : new Types.ObjectId(`${id}`) });
        if (cart.status === false) {
            return res.status(400).json({ message: "Product not found" });
        }
        await deleteRecord(GyroCartModel, { _id : new Types.ObjectId(`${id}`) });
        res.status(200).json({
            message: "Product removed from cart successfully",
            status: true,
            count: 1,
            product: cart.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getCartList = async (req, res) => {
    const { user_id } = req.body;
    try {
        const cart = await GyroCartModel.aggregate([
            {
              '$match': {
                'user_id': new Types.ObjectId(`${user_id}`)
              }
            }, {
              '$lookup': {
                'from': 'gyro_products', 
                'localField': 'product_id', 
                'foreignField': '_id', 
                'as': 'product_details'
              }
            }
          ])
        res.status(200).json({
            message: "Cart list fetched successfully",
            status: true,
            count: cart.count,
            cart: cart
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getOrderList = async (req, res) => {
    try {
        const { createdAt, name, user_id ,category, quantity, price, sort, limit = 50, page = 1 } = req.query;
        if(!user_id){
            return res.status(400).json({ message: "User Id is required in query params" });
        }
        const filters = {
            user_id: new Types.ObjectId(`${user_id}`)
        };  
        if (createdAt) {
            const [startDate, endDate] = createdAt.split(',');
            filters.createdAt = {
                ...(startDate ? { $gte: new Date(startDate) } : {}),
                ...(endDate ? { $lte: new Date(endDate) } : {}),
            };
        }
        if (name) {
            filters.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filters.category = { $regex: category, $options: 'i' };
        }
        if (quantity) {
            const [minQuantity, maxQuantity] = quantity.split(',');
            filters.quantity = {
                ...(minQuantity ? { $gte: parseInt(minQuantity, 10) } : {}),
                ...(maxQuantity ? { $lte: parseInt(maxQuantity, 10) } : {}),
            };
        }
        if (price) {
            const [minPrice, maxPrice] = price.split(',');
            filters.price = {
                ...(minPrice ? { $gte: parseFloat(minPrice) } : {}),
                ...(maxPrice ? { $lte: parseFloat(maxPrice) } : {}),
            };
        }
    
        const sortOptions = sort ? sort.split(',').join(' ') : '-createdAt';
        const resultsLimit = parseInt(limit, 10) || 50;
        const currentPage = parseInt(page, 10) || 1;
        const skip = (currentPage - 1) * resultsLimit;
    
        const [orders, count] = await Promise.all([
            GyroCheckoutModel.find(filters).sort(sortOptions).skip(skip).limit(resultsLimit),
            GyroCheckoutModel.countDocuments(filters),
        ]);
    
        const totalPages = Math.ceil(count / resultsLimit);
    
        res.status(200).json({
            message: "Orders list fetched successfully",
            status: true,
            count: orders.length,
            currentPage,
            totalPages,
            limit: resultsLimit,
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ 
            message: "An error occurred while fetching orders", 
            error: error.message 
        });
    }
    
};


const createCheckout = async (req, res) => {
    const { 
        user_id , 
        order_id , 
        payment_mode , 
        payment_id,
        is_applied_promo_code,
        promo_discount,
        status
    } = req.body;
    try {
        const checkoutObj = {
            user_id: user_id,
            order_id: order_id,
            payment_mode: payment_mode,
            payment_id: payment_id,
            is_applied_promo_code: is_applied_promo_code,
            promo_discount: promo_discount,
            status: status
        }
        const checkout = await createRecord(GyroCheckoutModel, checkoutObj);
        res.status(200).json({
            message: "Checkout created successfully",
            status: true,
            count: 1,
            checkout: checkout.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getCheckoutList = async (req, res) => {
    const { user_id } = req.body;
    try {
        const checkout = await getRecord(GyroCheckoutModel, { user_id });
        res.status(200).json({
            message: "Checkout list fetched successfully",
            status: true,
            count: checkout.count,
            checkout: checkout.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        if(!id){
            return res.status(400).json({ message: "User Id is required in params" });
        }
        const user = await getRecord(GyroUserModel, { _id: new Types.ObjectId(`${id}`) });
        res.status(200).json({
            message: "User profile fetched successfully",
            status: true,
            user: user.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name , email , number } = req.body;
    try {
        if(!id){
            return res.status(400).json({ message: "User Id is required in params" });
        }
        const user = await updateRecord(GyroUserModel, { _id: new Types.ObjectId(`${id}`) }, { $set: { name , email , number } });
        res.status(200).json({
            message: "User profile updated successfully",
            status: true,
            user: user.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

export {
    getProductsList,
    getCartList,
    getOrderList,
    addProductToCart,
    removeProductFromCart,
    createCheckout,
    getUserProfile,
    updateUserProfile
}