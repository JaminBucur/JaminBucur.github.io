"use strict";
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

router.get("/home", userController.homePage);
router.get("/products", userController.productsPage);
router.get("/about", userController.aboutPage);
router.get("/bbpue", userController.bbpuePage);
router.get("/products/:productID", userController.productDetailsPage);
router.get("/search", userController.search);
router.get("/cart", userController.cartPage);
router.get("/recipes", userController.recipesPage);

router.post("/cart/add", userController.addProductToCart);
router.post("/bbpue/signup", userController.setTier);
router.post("/products/sort", userController.sortProducts);
router.post("/categories/create", userController.createCategory);
router.post("/categories/delete", userController.deleteCategory);
router.post("/cart/update/:productID", userController.updateCartItem);
router.post("/cart/checkout", userController.purchaseProducts);
router.post("/cart/coupon", userController.getCoupon);

module.exports = router;