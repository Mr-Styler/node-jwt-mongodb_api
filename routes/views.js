const express = require('express');
const router = express.Router();

// Home route - Render the form for user input
router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Our Website'});
});

router.get('/docs', (req, res) => {
    res.render('dcoumentation', { title: 'API Documentation'});
});

// Render 404 Page for undefined routes
router.use((req, res) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

const viewsRoutes = router;
module.exports = viewsRoutes;