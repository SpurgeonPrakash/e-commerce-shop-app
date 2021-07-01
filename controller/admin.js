const Product = require("../models/product");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddproduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
    });
  }

  const product = new Product({
    title: title,
    imageUrl: image.path,
    price: price,
    description: description.trim(),
    userId: req.user._id,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err)
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err)
    });
};

exports.getEditProduct = (req, res, next) => {
  const editing = req.query.edit;
  if (!editing) {
    return res.redirect("/");
  }
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: editing,
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err)
    });
};

exports.postEditProduct = (req, res, next) => {
  const image = req.file;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product || product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = req.file.path;
      }
      product.price = updatedPrice;
      product.description = updatedDescription.trim();
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err)
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        if (!product) {
            console.log("No Product Found!");
          return res.redirect('/admin/products');
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id });
      })
      .then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(err)
      });
  };
