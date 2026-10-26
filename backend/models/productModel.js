import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  categoryName: {
    type: String, 
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
  },
});

// Method to update stock quantity
productSchema.methods.updateStock = async function(amount) {
  this.stockQuantity += amount;
  return this.save();
};

// Method to check if stock is low
productSchema.methods.isLowStock = function(threshold) {
  return this.stockQuantity <= threshold;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
