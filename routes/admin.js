const express = require('express');
const router = express.Router();

const adminController = require("../controller/admin");
const isAuth = require("../middleware/is-Auth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post("/add-product", isAuth, adminController.postAddproduct);

router.get('/products', isAuth,  adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product/', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;