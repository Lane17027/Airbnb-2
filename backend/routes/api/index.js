// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const { restoreUser, requireAuth } = require("../../utils/auth.js");
const {
  User,
  Review,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null

router.use(restoreUser);

//Delete a Spot Image
//Completed
router.delete("/spot-images/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { imageId } = req.params;

  const imageToDelete = await SpotImage.findOne({
    where: {
      id: imageId,
    },
  });

  if (!imageToDelete) {
    res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  const spot = await Spot.findOne({
    where: {
      id: imageToDelete.spotId,
    },
  });

  if (user.id !== spot.ownerId) {
    res.status(403).json({
      message: "Forbidden",
    });
  }

  await imageToDelete.destroy();

  res.status(200).json({
    message: "Successfully deleted",
  });
});

//Delete a Review Image
router.delete(
  "/review-images/:imageId",
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { imageId } = req.params;

    const reviewImageToDelete = await ReviewImage.findOne({
      where: {
        id: imageId,
      },
    });

    if (!reviewImageToDelete) {
      res.status(404).json({
        message: "Review Image couldn't be found",
      });
    }

    const review = await Review.findOne({
      where: {
        id: reviewImageToDelete.reviewId,
      },
    });

    if (user.id !== review.userId) {
      res.status(403).json({
        message: "Forbidden",
      });
    }

   await reviewImageToDelete.destroy()

   res.status(200).json({
    "message": "Successfully deleted"
  })
  }
);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/spots", spotsRouter);

router.use("/reviews", reviewsRouter);

router.use("/bookings", bookingsRouter);

// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });

module.exports = router;
