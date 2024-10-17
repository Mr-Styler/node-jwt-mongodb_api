const express = require('express');
const Blog = require('../models/Blog');
const { getAllBlogs, getBlog, updateBlog, deleteBlog, createBlog } = require('../controllers/blogController');
const { isAuthenticated, isAuthorized } = require('../middleware');

const router = express.Router();

router.get('/', getAllBlogs)
router.get('/:id', getBlog)

router.use(isAuthenticated)
router.post('/', (req, res, next) => {
    req.body.createdBy = req.user._id
    next()
}, createBlog)

router.use(isAuthorized(Blog, 'createdBy'))
router.route("/:id").patch(updateBlog).delete(deleteBlog)

const blogRoutes = router;
module.exports = blogRoutes;