import easync from '../easync'
import {Router} from 'express'
export default Router()
	.get('/', (req, res) => res.render('index'))
	.get('/err', easync(async () => { throw new Error('TEST TEST TEST') }))
