var returnCache = function(redis) {
	
	function cache(req, res, next) {
    const handle = req.body.handle;
    redis.get(handle,function (err, data) {
        if (err) throw err;
        
        if (data != null) {
            res.send(data);
        } else {
            next();
        }
    });
}
    return cache;
}
module.exports = returnCache;