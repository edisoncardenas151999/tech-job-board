const router= require('express').Router();

//  GET  route to display the About Page
router.get('/about', (req, res, ) => {
    res.render('about', { title:"About", user: req.session.user});
});

// GEt route to display the Service Page

router.get('/service', (req, res, ) => {
    res.render('service', { title:"Service", user: req.session.user});
});
module.exports = router;

