"use strict";
const express = require("express");
const multer = require("multer");
const adminController = require("../controllers/admin.controller");

module.exports = function (imageUpload, fileUpload) {
    const router = express.Router();
    router.get("/bulkUpload", adminController.bulkUploadPage);
    router.get("/edit/:productID", adminController.editProductPage);
    router.get("/discounts", adminController.discountsPage);

    router.post("/uploadProducts", fileUpload.array('file'), adminController.uploadProducts);
    router.post("/editProduct/:productID", imageUpload.array('imageUpload'), adminController.editProduct);
    router.post("/addProduct", adminController.addProduct);
    router.post("/deleteProduct/:productID", adminController.deleteProduct);
    router.post("/discounts/create", adminController.createDiscount);
    router.post("/discounts/delete/:discountID", adminController.deleteDiscount);
    router.post("/coupon/create", adminController.createCoupon);
    router.post("/coupon/delete/:code", adminController.deleteCoupon);

    return router;
}
