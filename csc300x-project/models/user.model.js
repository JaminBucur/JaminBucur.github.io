"use strict";
const db = require("../models/db-conn");

function getProducts() {
    const sql = `SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue, IFNULL(d.discountCaption, '') AS discountCaption
        FROM Products p
        LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
        LEFT JOIN Discounts d ON pd.discountID = d.discountID`;
    return db.all(sql);
}

function getProductDetails(productID) {
    const sql = `SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue, IFNULL(d.discountCaption, '') AS discountCaption
        FROM Products p
        LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
        LEFT JOIN Discounts d ON pd.discountID = d.discountID
        WHERE p.productID = ?`;
    return db.get(sql, productID);
}

function getNutritionDetails(productID) {
    const sql = `SELECT * FROM Nutrition WHERE productID = ?`;
    return db.get(sql, productID);
}

function getCategories() {
    const sql = `SELECT * FROM Categories ORDER BY menuOrder`;
    return db.all(sql);
}

function getFeaturedProducts() {
    const sql = `SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue, IFNULL(d.discountCaption, '') AS discountCaption
        FROM Products p
        LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
        LEFT JOIN Discounts d ON pd.discountID = d.discountID
        WHERE p.featured = 1`;
    return db.all(sql);
}

function setTier(userID) {
    const sql = `UPDATE Users SET tier = 'bbpue' WHERE userID = ?`;
    return db.run(sql, userID);
}

function sortProducts(category, sortBy) {
    let sql;
    if (category) {
        if (sortBy) {
            sql = `SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue
                FROM Products p
                LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
                LEFT JOIN Discounts d ON pd.discountID = d.discountID
                WHERE p.categoryID = ?
                ORDER BY `;

            if (sortBy === 'price ASC') {
                sql += `(p.price - (IFNULL(d.discountValue, 0) * p.price)) ASC`;
            } else if (sortBy === 'price DESC') {
                sql += `(p.price - (IFNULL(d.discountValue, 0) * p.price)) DESC`;
            } else {
                sql += `p.${sortBy}`;
            }
            return db.all(sql, category);
        } else {
            sql = `SELECT * FROM Products WHERE categoryID = ?`;
            return db.all(sql, category);
        }
    } else {
        if (sortBy) {
            sql = `SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue
                FROM Products p
                LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
                LEFT JOIN Discounts d ON pd.discountID = d.discountID
                ORDER BY `;

            if (sortBy === 'price ASC') {
                sql += `(p.price - (IFNULL(d.discountValue, 0) * p.price)) ASC`;
            } else if (sortBy === 'price DESC') {
                sql += `(p.price - (IFNULL(d.discountValue, 0) * p.price)) DESC`;
            } else {
                sql += `p.${sortBy}`;
            }
            return db.all(sql);
        } else {
            sql = `SELECT * FROM Products`;
            return db.all(sql);
        }
    }
}


function createCategory(categoryName, menuOrder) {
    const sql = `INSERT INTO Categories (categoryName, menuOrder) VALUES (?, ?)`;
    const params = [categoryName, menuOrder];
    return db.run(sql, params);
}

function deleteCategory(categoryID) {
    const sql = `DELETE FROM Categories WHERE categoryID = ?`;
    return db.run(sql, categoryID);
}

function search(searchTerm) {
    const sql = `
        SELECT p.*, IFNULL(d.discountValue, 0) AS discountValue
        FROM Products p
        LEFT JOIN ProductDiscounts pd ON p.productID = pd.productID
        LEFT JOIN Discounts d ON pd.discountID = d.discountID
        WHERE productName LIKE ?`;
    return db.all(sql, `%${searchTerm}%`);
}

function newCart(userID) {
    const sql = `INSERT INTO Carts (userID, status) VALUES (?, 'new')`;
    return db.run(sql, userID);
}

function getCart(userID) {
    const sql = `SELECT * FROM Carts WHERE userID = ? AND status = 'new'`;
    return db.get(sql, userID);
}


function addProductToCart(userID, productID, quantity) {
    const sql = `INSERT INTO CartProducts (cartID, productID, quantity) 
        VALUES ((SELECT cartID FROM Carts WHERE userID = ? AND status = 'new'), ?, ?)`;
    const params = [userID, productID, quantity];
    return db.run(sql, params);
}

function getCartItems(userID) {
    const sql = `SELECT Products.*, CartProducts.quantity, Discounts.discountValue
        FROM Products
        JOIN CartProducts ON Products.productID = CartProducts.productID
        JOIN Carts ON CartProducts.cartID = Carts.cartID
        LEFT JOIN ProductDiscounts ON Products.productID = ProductDiscounts.productID
        LEFT JOIN Discounts ON ProductDiscounts.discountID = Discounts.discountID
        WHERE Carts.userID = ? AND Carts.status = 'new' -- Assuming you want items from active carts`;
    return db.all(sql, userID);
}

function getCartItem(userID, productID) {
    const sql = `SELECT * FROM CartProducts
        WHERE productID = ? AND cartID = (SELECT cartID FROM Carts WHERE userID = ? AND status = 'new')`;
    const params = [productID, userID];
    return db.get(sql, ...params);
}

function updateCartItem(userID, productID, quantity) {
    const sql = `UPDATE CartProducts
        SET quantity = ?
        WHERE productID = ? AND cartID = (SELECT cartID FROM Carts WHERE userID = ? AND status = 'new')`;
    const params = [quantity, productID, userID];
    return db.run(sql, params);
}

function deleteCartItem(userID, productID) {
    const sql = `DELETE FROM CartProducts
        WHERE productID = ? AND cartID = (SELECT cartID FROM Carts WHERE userID = ? AND status = 'new')`;
    const params = [productID, userID];
    return db.run(sql, params);
}

function getCartCount(userID) {
    const sql = `SELECT SUM(quantity) AS itemCount
        FROM CartProducts
        JOIN Carts ON CartProducts.cartID = Carts.cartID
        WHERE Carts.userID = ? AND Carts.status = 'new'`;

    const row = db.get(sql, userID);
    return row.itemCount || 0;
}

function editCartStatus(status, userID) {
    const sql = `UPDATE Carts SET status = ? WHERE userID = ?`;
    const params = [status, userID];
    return db.run(sql, params);
}

function getCoupon(code) {
    const sql = `SELECT * FROM CouponCodes WHERE code = ?`;
    return db.get(sql, code);
}

module.exports = {
    getProducts,
    getProductDetails,
    getNutritionDetails,
    getCategories,
    getFeaturedProducts,
    setTier,
    sortProducts,
    createCategory,
    deleteCategory,
    search,
    newCart,
    getCart,
    addProductToCart,
    getCartItems,
    getCartItem,
    updateCartItem,
    deleteCartItem,
    getCartCount,
    editCartStatus,
    getCoupon
};