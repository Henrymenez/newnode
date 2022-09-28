const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A Tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a GroupSize'],
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty'],
  },

  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQauntity: {
    type: Number,
    defualt: 0,
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A Tour must have a summary']
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A Tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
},
{
  toJSON: { virtual: true },
  toObject: { virtual: true },
});

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})
const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;