"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/user.model");

function homePage(req, res) {
    try {
        const cartCount = model.getCartCount(req.session.userID);
        const featured = model.getFeaturedProducts();
        res.render('index', { userType: req.session.userType, featured: featured, cartCount: cartCount });

    }
    catch (err) {
        console.error("Error while rendering home page: " + err.message);
    }
}

function productsPage(req, res) {
    try {
        const lastSortBy = req.session.lastSortBy || '';
        const lastCategory = req.session.lastCategory || '';
        const rows = model.getProducts();
        const categories = model.getCategories();
        const cartCount = model.getCartCount(req.session.userID);
        res.render('products', { userType: req.session.userType, Products: rows, lastSortBy: lastSortBy, lastCategory: lastCategory, categories: categories, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering products page: " + err.message);
    }
}

function bbpuePage(req, res) {
    try {
        const cartCount = model.getCartCount(req.session.userID);
        res.render('bbpue', { userType: req.session.userType, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering bbpue page: " + err.message);
    }
}

function searchPage(req, res) {
    try {
        const products = 0;
        const cartCount = model.getCartCount(req.session.userID);
        res.render('search', { userType: req.session.userType, products: products, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering search page: " + err.message);
    }
}

function search(req, res) {
    try {
        const term = req.query.term;
        const products = model.search(term);
        const cartCount = model.getCartCount(req.session.userID);
        res.render('search', { userType: req.session.userType, products: products, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while searching: " + err.message);
    }
}


function cartPage(req, res) {
    try {
        const cartItems = model.getCartItems(req.session.userID);
        const cartCount = model.getCartCount(req.session.userID);
        const discount = 0;
        res.render('cart', { userType: req.session.userType, tier: req.session.tier, cartItems: cartItems, cartCount: cartCount, discount: discount });
    }
    catch (err) {
        console.error("Error while rendering cart page: " + err.message);
    }
}

function setTier(req, res) {
    try {
        model.setTier(req.session.userID);
        req.session.tier = 'bbpue';
        res.redirect('/home');
    }
    catch (err) {
        console.error("Error while setting user to TEIR: " + err.message);
    }
}

function sortProducts(req, res) {
    try {
        const sortBy = req.body.sortBy;
        const category = req.body.category;
        req.session.lastSortBy = sortBy;
        req.session.lastCategory = category;
        const rows = model.sortProducts(category, sortBy);
        const categories = model.getCategories();
        const cartCount = model.getCartCount(req.session.userID);
        res.render('products', { userType: req.session.userType, Products: rows, lastSortBy: sortBy, lastCategory: category, categories: categories, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering sorted products page: " + err.message);
    }
}

function aboutPage(req, res) {
    try {
        const cartCount = model.getCartCount(req.session.userID);
        res.render('about', { userType: req.session.userType, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering about page: " + err.message);
    }
}

function productDetailsPage(req, res) {
    try {
        const product = model.getProductDetails(req.params.productID);
        const nutrition = model.getNutritionDetails(req.params.productID);
        const imageUrls = product.image.split(',').map(url => url.trim());
        const cartCount = model.getCartCount(req.session.userID);
        res.render('details', { userType: req.session.userType, product: product, nutrition: nutrition, imageUrls: imageUrls, cartCount: cartCount });
    }
    catch (err) {
        console.error("Error while rendering product details page: " + err.message);
    }
}

function createCategory(req, res) {
    try {
        const categoryName = req.body.categoryName;
        const menuOrder = req.body.menuOrder;
        model.createCategory(categoryName, menuOrder);
        res.redirect('/products');
    }
    catch (err) {
        console.error("Error while creating category: " + err.message);
    }
}

function deleteCategory(req, res) {
    try {
        const categoryID = req.body.categoryID;
        model.deleteCategory(categoryID);
        res.redirect('/products');
    }
    catch (err) {
        console.error("Error while deleting category: " + err.message);
    }
}

function addProductToCart(req, res) {
    try {
        const productID = req.body.productID;
        const quantity = parseInt(req.body.quantity);
        const existingItem = model.getCartItem(req.session.userID, productID);
        const exists = model.getCart(req.session.userID)

        if (!exists) {
            model.newCart(req.session.userID);
        }

        if (existingItem) {
            model.updateCartItem(req.session.userID, productID, (existingItem.quantity + quantity));
            res.redirect('/cart')
        } else {
            model.addProductToCart(req.session.userID, productID, quantity);
            res.redirect('/cart')
        }
    }
    catch (err) {
        console.error("Error while adding product to cart: " + err.message);
    }
}

function updateCartItem(req, res) {
    try {
        const productID = req.body.productID;
        const quantity = req.body.quantity;

        if (quantity <= 0) {
            model.deleteCartItem(req.session.userID, productID);
            res.redirect('/cart');
        }

        model.updateCartItem(req.session.userID, productID, quantity);
        res.redirect('/cart');
    }
    catch (err) {
        console.error("Error while updating cart item: " + err.message);
    }
}

function purchaseProducts(req, res) {
    try {
        model.editCartStatus('purchased', req.session.userID);
        res.render('purchased', { userType: req.session.userType, cartCount: 0 });
    }
    catch (err) {
        console.error("Error while purchasing products: " + err.message);
    }
}

function getCoupon(req, res) {
    try {
        const code = req.body.code;
        const coupon = model.getCoupon(code);

        if (coupon) {
            const cartItems = model.getCartItems(req.session.userID);
            const cartCount = model.getCartCount(req.session.userID);
            const discount = coupon.codeValue;
            res.render('cart', { userType: req.session.userType, tier: req.session.tier, cartItems: cartItems, cartCount: cartCount, discount: discount });
        } else {
            const cartItems = model.getCartItems(req.session.userID);
            const cartCount = model.getCartCount(req.session.userID);
            const discount = 0;
            res.render('cart', { userType: req.session.userType, tier: req.session.tier, cartItems: cartItems, cartCount: cartCount, discount: discount, error: 'Invalid coupon code' });
        }
    }
    catch (err) {
        console.error("Error while getting coupon: " + err.message);
    }
}

async function recipesPage(req, res) {
    try {
        let term = req.query.term;
        const cartCount = model.getCartCount(req.session.userID);

        if (!term) {
            term = 'beef';
        }

        const response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        res.render('recipes', { userType: req.session.userType, cartCount: cartCount, meals: data.meals });
    } catch (err) {
        console.error("Error while rendering recipe page: " + err.message);
    }
}

module.exports = {
    homePage,
    productsPage,
    bbpuePage,
    searchPage,
    search,
    cartPage,
    setTier,
    sortProducts,
    aboutPage,
    productDetailsPage,
    createCategory,
    deleteCategory,
    addProductToCart,
    updateCartItem,
    purchaseProducts,
    getCoupon,
    recipesPage
};