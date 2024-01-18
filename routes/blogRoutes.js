const { Router } = require('express') 

const blogController = require('../controllers/blogController')

const router = Router() 

const {requireAuth,checkUser} = require('../middleware/authMiddleware.js')



router.get('*',checkUser) // '*' makes function checkUser get fired in every get req route
router.get('/blogs',blogController.blogs_get)
router.post('/blogs',blogController.blogs_post)
router.get('/about',blogController.about_get)
router.get('/create',requireAuth,blogController.create_get)
router.get('/blogs/:id',blogController.blogsid_get)
router.delete('/blogs/:id',checkUser,blogController.blogs_delete)


module.exports = router ;