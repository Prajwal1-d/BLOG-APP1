const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const {protect} = require('../middleware/authmiddleware');
const { createPost, updatePost, deletePost, getPost, getAllPosts, getEveryPosts , toggleLike , addComment } = require ('../controllers/postController');



router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);

router.post('/create', protect, createPost);
router.put('/update/:id', protect, updatePost);
router.delete('/delete/:id', protect, deletePost);

router.get('/post/:id', protect, getPost);
router.get('/posts', protect, getAllPosts);
router.get('/allposts', protect, getEveryPosts);

router.put('/like/:id', protect, toggleLike);
router.post('/comment/:id', protect, addComment);




module.exports = router;