const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { User, Booking, Spot, SpotImage } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//Get all of the Current User's Bookings
//I think completed
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  const userId = user.id;

  const myBookingsForSpots = await Booking.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!myBookingsForSpots.length) {
    res.status(404).json("Booking couldn't be found");
  }

  for (let booking of myBookingsForSpots) {
    let spotImage = await SpotImage.findOne({
      where: {
        spotId: booking.spotId,
      },
    });
    let spot = await Spot.findOne({
      where: {
        id: booking.spotId,
      },
    });
    if (!spotImage) {
      booking.dataValues.Spot.dataValues.previewImage =
        "There is no preview Image for this spot";
    } else {
      booking.dataValues.Spot.dataValues.previewImage =
        spotImage.dataValues.url;
    }
  }

  res.status(200).json({ Bookings: myBookingsForSpots });
});

//Edit a Booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);

    //setup for date comparison
    const newStartDate = new Date(startDate).getTime();
    const newEndDate = new Date(endDate).getTime();

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (userId !== booking.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this booking" });
    }

    const currentDate = new Date().getTime();
    // const exampleEndDate = new Date(endDate).getTime();
    if (newEndDate < currentDate) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }

    const currBookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
      },
    });
currBookings.forEach((bookings) => {
      const bookingStartDate = new Date(
        bookings.dataValues.startDate
      ).getTime();
      const bookingEndDate = new Date(bookings.dataValues.endDate).getTime();

      const errorsObj = {};
      console.log(bookings.dataValues);

      if (bookings.dataValues.id === bookingId) {
        booking.update({
          startDate,
          endDate,
        });

        return res.status(200).json(booking);
      }


      if (newStartDate >= bookingStartDate && newStartDate <= bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }


      if (newEndDate >= bookingStartDate && newEndDate <= bookingEndDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newStartDate < bookingStartDate && newEndDate > bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newStartDate === bookingStartDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }

      if (newStartDate === bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }

      if (newEndDate === bookingEndDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newEndDate === bookingStartDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (errorsObj.startDate || errorsObj.endDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: errorsObj,
        });
      }
    });
res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


//Delete a Booking
//Completed
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { bookingId } = req.params;

  const bookingToDelete = await Booking.findByPk(bookingId);

  if (!bookingToDelete) {
    res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  if (bookingToDelete.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const startDate = new Date(bookingToDelete.startDate).getTime();
  const endDate = new Date(bookingToDelete.endDate).getTime();
  const today = new Date().getTime();

  if (today > startDate) {
    res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await bookingToDelete.destroy({
    message: "Successfully deleted",
  });

  res.status(200).json();
});

module.exports = router;
