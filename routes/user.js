const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { isAuthenticated, restrictTo } = require('../middleware');

const router = express.Router();

router.use(isAuthenticated)

router.use("/me", (req, res, next) => {
    req.params.id = req.user._id

    next()
})

router.route("/me").get(getUser).patch(updateUser).delete(deleteUser)

router.use(restrictTo("admin"))
router.get('/', getAllUsers)
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser)

const userRoutes = router;
module.exports = userRoutes;