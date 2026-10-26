import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Optionally, you can add a description or imageURL for categories
  description: {
    type: String,
    default: '',
  },
  imageURL: {
    type: String,
    default: '',
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
