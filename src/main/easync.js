export default function (middleware) {
	return (req, res, next) => Promise.resolve(middleware(req, res, next))
		.catch(err => next(err))
}
