const express = require('express');
const router = express.Router();

const shopController = require("../controller/shop");
const errorController = require("../controller/error")

const isAuth = require("../middleware/is-Auth");


router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteItem);

router.get("/checkout", shopController.getCheckout)

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/checkout/success", shopController.getCheckoutSuccess)

router.get("/checkout/cancel", shopController.getCheckout)

router.get("/orders", isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/500', errorController.get500);

module.exports = router;