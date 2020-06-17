const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    referenceNo: {
      type: String,
      required: true,
    },
    reservationDate: {
      type: String,
      required: true,
    },
    reservationTime: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.ObjectId,
      required: true,
    },
    serviceId: {
      type: mongoose.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
