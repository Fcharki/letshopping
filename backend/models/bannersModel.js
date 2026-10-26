import mongoose from 'mongoose';


// define the banner schema
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true, // URL to redirect when the banner is clicked
  },
  startDate: {
    type: Date,
    required: true, // to set a display period
  },
  endDate: {
    type: Date,
    required: true, // to set a display period
  },
  active: {
    type: Boolean,
    default: true, // To toggle visibility
  },
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;