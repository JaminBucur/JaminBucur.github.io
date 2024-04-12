"use strict";
const db = require("../models/db-conn");

function isAdmin(userType) {
    return userType === "admin";
}

function addProduct(product) {
    const sql = `INSERT INTO Products (productName, description, categoryID, price, image, ingredients, directions, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [product.productName, product.description, product.categoryID, product.price, product.image, product.ingredients, product.directions, product.featured];
    return db.run(sql, params);
}

function deleteProduct(productID) {
    const sql = 'DELETE FROM Nutrition WHERE productID = ?';
    db.run(sql, productID);
    const sql2 = `DELETE FROM Products WHERE productID = ?`;
    return db.run(sql2, productID);
}

function addNutrition(nutrition) {
    const sql = `INSERT INTO Nutrition (servings_per_container, serving_size, calories, total_fat, cholesterol, sodium, total_carbohydrates, sugars, protein, productID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [nutrition.servings_per_container, nutrition.serving_size, nutrition.calories, nutrition.total_fat, nutrition.cholesterol, nutrition.sodium, nutrition.total_carbohydrates, nutrition.sugars, nutrition.protein, nutrition.productID];
    return db.run(sql, params);
}

function editProduct(product) {
    const sql = `UPDATE Products SET productName = ?, description = ?, categoryID = ?, price = ?, image = ?, ingredients = ?, directions = ?, featured = ? WHERE productID = ?`;
    const params = [product.productName, product.description, product.categoryID, product.price, product.image, product.ingredients, product.directions, product.featured, product.productID];
    return db.run(sql, params);
}

function editNutrition(nutrition) {
    const sql = `UPDATE Nutrition SET servings_per_container = ?, serving_size = ?, calories = ?, total_fat = ?, cholesterol = ?, sodium = ?, total_carbohydrates = ?, sugars = ?, protein = ? WHERE productID = ?`;
    const params = [nutrition.servings_per_container, nutrition.serving_size, nutrition.calories, nutrition.total_fat, nutrition.cholesterol, nutrition.sodium, nutrition.total_carbohydrates, nutrition.sugars, nutrition.protein, nutrition.productID];
    return db.run(sql, params);
}

function getProductDetails(productID) {
    const sql = `SELECT * FROM Products WHERE productID = ?`;
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

function getDiscount() {
    const sql = `SELECT * FROM Discounts`;
    return db.all(sql);
}

function createDiscount(discountValue, discountCaption) {
    const sql = 'INSERT INTO Discounts (discountValue, discountCaption) VALUES (?, ?)';
    const params = [discountValue, discountCaption];
    return db.run(sql, params);
}

function deleteDiscount(discountID) {
    const sql = 'DELETE FROM Discounts WHERE discountID = ?';
    return db.run(sql, discountID);
}

function addDiscountToProduct(productID, discountID) {
    const sql = `INSERT OR REPLACE INTO ProductDiscounts (productID, discountID) VALUES (?, ?)`;
    const params = [productID, discountID];
    return db.run(sql, params);
}

function getDiscountedProducts() {
    const sql = `SELECT Products.*, Discounts.* 
                 FROM Products 
                 LEFT JOIN ProductDiscounts ON Products.productID = ProductDiscounts.productID
                 LEFT JOIN Discounts ON ProductDiscounts.discountID = Discounts.discountID`;
    return db.all(sql);
}

function removeDiscountFromProduct(productID) {
    const sql = 'DELETE FROM ProductDiscounts WHERE productID = ?';
    return db.run(sql, productID);
}

function createCoupon(code, codeValue, expirationDate) {
    const sql = 'INSERT INTO CouponCodes (code, codeValue, expirationDate) VALUES (?, ?, ?)';
    const params = [code, codeValue, expirationDate];
    return db.run(sql, params);
}

function deleteCoupon(code) {
    const sql = 'DELETE FROM CouponCodes WHERE code = ?';
    return db.run(sql, code);
}

function getCoupons() {
    const sql = 'SELECT * FROM CouponCodes';
    return db.all(sql);
}

module.exports = {
    isAdmin,
    addProduct,
    deleteProduct,
    addNutrition,
    editProduct,
    editNutrition,
    getProductDetails,
    getNutritionDetails,
    getCategories,
    getDiscount,
    createDiscount,
    deleteDiscount,
    addDiscountToProduct,
    getDiscountedProducts,
    removeDiscountFromProduct,
    createCoupon,
    deleteCoupon,
    getCoupons
};