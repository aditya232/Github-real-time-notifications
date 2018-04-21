function auth(req, res, next) {
    const auth = req.headers.authorization;
        if (auth !=process.env.SECRET) {
            res.status(403).end('Forbidden access');
        } else {
            next();
        }
}

module.exports = auth;