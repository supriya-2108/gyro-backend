import { Types } from "mongoose";
import GyroProductsModel from "../models/gyro_products_schema.model.js";
import { createRecord, deleteRecord, getAllRecord, getRecord, updateRecord } from "../common/common_database_queries.js";
import GyroCheckoutModel from "../models/gyro_checkout_schema.model.js";

const createProduct = async (req, res) => {
    const {product_id , name , description , price , image , category , quantity } = req.body;
    try {
        let existingProduct = await getRecord(GyroProductsModel, { product_id: product_id });
        if (existingProduct.status) {
            return res.status(400).json({ message: "Product already exists" });
        }
        const product = await createRecord(GyroProductsModel, { name , description , price , image , category , quantity , product_id });
        res.status(200).json({
            message: "Product created successfully",
            status: true,
            count: 1,
            product: product.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name , description , price , image , category , quantity , isAvailable , product_id } = req.body;
    try {
        let updateObject = {};
        let condObj = { _id: new Types.ObjectId(`${id}`) };
        if(name) updateObject.name = name;
        if(description) updateObject.description = description;
        if(price) updateObject.price = price;
        if(image) updateObject.image = image;
        if(category) updateObject.category = category;
        if(quantity) updateObject.quantity = quantity;
        if(isAvailable) updateObject.isAvailable = isAvailable;
        if(product_id) updateObject.product_id = product_id;
        let existingProduct = await getRecord(GyroProductsModel, condObj);
        if (!existingProduct) {
            return res.status(400).json({ message: "Product not found" });
        }
        const product = await updateRecord(GyroProductsModel , condObj, updateObject);
        res.status(200).json({
            message: "Product updated successfully",
            status: true,
            count: 1,
            product: product.data
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const product = await deleteRecord(GyroProductsModel, { _id: new Types.ObjectId(id) });
        res.status(200).json({
            message: "Product deleted successfully",
            status: true
        });
    } catch ( error ) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const getProductsList = async (req, res) => {
    try {
        const { createdAt, name, category, quantity, price, sort, limit = 50, page = 1 } = req.query;
        const filters = {};  
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
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            message: "An error occurred while fetching products", 
            error: error.message 
        });
    }
    
};

const getOrdersList = async (req, res) => {
    try {
        const { createdAt, name, category, quantity, price, sort, limit = 50, page = 1 } = req.query;
        const filters = {};  
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

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsList,
    getOrdersList,
}