const Blog = require('../models/Blog');
const { getAll, getOne, deleteOne, updateOne, createNew } = require('../utils/crudHandler');

exports.getAllBlogs = getAll(Blog)
exports.getBlog = getOne(Blog)
exports.createBlog = createNew(Blog)
exports.updateBlog = updateOne(Blog)
exports.deleteBlog = deleteOne(Blog)
