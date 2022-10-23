const mongoose = require('mongoose');
// const User = require("./userModel");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour must have at most 40 characters'],
      minlength: [10, 'A tour must have at least 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium or difficult',
      },
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount Price  should be less than price',
      },
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The rating must be above 1.0'],
      max: [5, 'The rating must be below 5.0'],
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
      required: [true, 'A Tour must have a summary'],
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
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinate: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//runs only ion save and create

//imbeding new document
// toursSchema.pre('save', async function(next){
// const guidesPromises = this.guides.map(async id => await User.findById(id))

// this.guides = await Promise.all(guidesPromises)

//   next();
// })
// toursSchema.pre('save', function (next) {
//   console.log(this);
// next();
// })

// toursSchema.post('save', function(doc,next) {
//   console.log(doc);
//   next();
// })

//query middleware regex to get all strings thar start with find

toursSchema.pre(/^find/, function (next) {
  // toursSchema.pre('find', function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.pre(/^find/,function(next){
  this.populate({ 
    path:  'guides',
    select: "-__v -passwordChangedAt"
  })

  next();
})


toursSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  // console.log(doc);
  next();
});

//aggregation middleware
toursSchema.pre('aggregate', function (next) {
  console.log(
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  );
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
