exports.property_submit = function(req, res, next) {
    req.sanitize('name').escape();
    req.sanitize('name').trim();
    res.send('name is:' + req.body.name);

}