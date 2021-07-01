const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  let newQuantity = 0
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString()
  });

  updatedCartItems = [...this.cart.items]
  if(cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    });
  }
  this.cart.items = updatedCartItems;
  this.save();

}

userSchema.methods.deleteCartItem = function(product) {
  const updatedCartItems = this.cart.items.filter(cp => {
    return cp.productId.toString() != product._id.toString()
  });
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart.items = [];
  return this.save();
}

module.exports = mongoose.model("User", userSchema);