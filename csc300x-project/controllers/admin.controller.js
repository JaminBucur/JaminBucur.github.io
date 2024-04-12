"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
const fs = require('fs');
app.use(multer().single('file'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/admin.model");

function bulkUploadPage(req, res) {
    try {
        if (req.session.userType === 'admin') {
            res.render('bulkUpload', { userType: req.session.userType });
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while rendering bulk upload page: " + err.message);
    }
}

function uploadProducts(req, res) {
    try {
        const products = JSON.parse(req.body.products).products;
        products.map(product => {
            const nutrition = product.nutrition;
            delete product.nutrition;

            const productResult = model.addProduct(product);
            const productId = productResult.lastInsertRowid;

            nutrition.productID = productId;
            model.addNutrition(nutrition);
        });
        res.redirect('/products');
    } catch (err) {
        console.error("Error while uploading product: " + err.message);
    }
}

function editProductPage(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const product = model.getProductDetails(req.params.productID);
            const nutrition = model.getNutritionDetails(req.params.productID);
            let imageUrls = [];
            if (product.image) {
                imageUrls = product.image.split(',').map(url => url.trim());
            }

            const categories = model.getCategories();
            const discounts = model.getDiscount();
            const productDiscount = model.getDiscountedProducts();

            res.render('editProduct', { userType: req.session.userType, product: product, nutrition: nutrition, imageUrls: imageUrls, categories: categories, discounts: discounts, productDiscount: productDiscount });
        }
        else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while rendering edit product page: " + err.message);
    }
}

function editProduct(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const productData = req.body.product;
            const product = productData;
            const nutrition = productData.nutrition;
            delete product.nutrition;
            const newImages = req.files;
            const imageNames = [];

            if (newImages) {
                newImages.forEach((image, index) => {
                    const imageName = image.originalname;
                    const imagePath = path.join(__dirname, '..', image.path);
                    const imageData = fs.readFileSync(imagePath);
                    const newImagePath = path.join(__dirname, '..', 'images', imageName);
                    fs.writeFileSync(newImagePath, imageData);
                    imageNames.push(imageName);
                });
            }

            if (imageNames.length > 0) {
                if (product.image) {
                    product.image += ',' + imageNames.join(',');
                } else {
                    product.image = imageNames.join(',');
                }
            }

            model.editProduct(product);
            model.editNutrition(nutrition);
            const productID = req.body.productID;
            const discountID = req.body.discountID;

            if (discountID) {
                model.addDiscountToProduct(productID, discountID);
            } else {
                model.removeDiscountFromProduct(productID);
            }

            res.redirect('/edit/' + product.productID);
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while editing product: " + err.message);
    }
}

function deleteProduct(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const productID = req.params.productID;
            model.deleteProduct(productID);
            res.redirect('/products');
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while deleting product: " + err.message);
        res.status(500).send("Internal Server Error");
    }
}

function discountsPage(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const discounts = model.getDiscount();
            const coupons = model.getCoupons();
            res.render('discounts', { userType: req.session.userType, discounts: discounts, coupons: coupons });
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while rendering discount page: " + err.message);
    }
}

function createDiscount(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const discountValue = req.body.discountValue;
            const discountCaption = req.body.discountCaption;
            model.createDiscount(discountValue, discountCaption);
            res.redirect('/discounts');
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    }
    catch (err) {
        console.error("Error while creating discount: " + err.message);
    }
}

function deleteDiscount(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const discountID = req.params.discountID;
            model.deleteDiscount(discountID);
            res.redirect('/discounts');
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while deleting discount: " + err.message);
    }
}

function createCoupon(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const code = req.body.code;
            const codeValue = req.body.codeValue;
            const expirationDate = req.body.expirationDate;
            model.createCoupon(code, codeValue, expirationDate);
            res.redirect('/discounts');
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while creating coupon: " + err.message);
    }
}

function deleteCoupon(req, res) {
    try {
        if (req.session.userType === 'admin') {
            const code = req.params.code;
            model.deleteCoupon(code);
            res.redirect('/discounts');
        } else {
            res.status(403).send("Forbidden - You are not authorized to access this page.");
        }
    } catch (err) {
        console.error("Error while deleting coupon: " + err.message);
    }
}

function addProduct(req, res) {
    let emptyProduct = {
        "featured": 0,
    };

    const productResult = model.addProduct(emptyProduct);
    const productID = productResult.lastInsertRowid;
    let emptyNutrition = {
        "productID": productID
    };

    model.addNutrition(emptyNutrition);
    res.redirect('/edit/' + productID);
}

module.exports = {
    bulkUploadPage,
    uploadProducts,
    editProductPage,
    editProduct,
    deleteProduct,
    discountsPage,
    createDiscount,
    deleteDiscount,
    createCoupon,
    deleteCoupon,
    addProduct
};