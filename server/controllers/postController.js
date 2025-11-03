
const Post = require('../models/Post');



 const createPost = async (request, response) => {
  try {
    const { title, description, picture } = request.body;
    const username = request.user.username
    

    // Create a new post
    const post = await Post.create({
      title,
      description,
      picture,
      username,
      createdDate: new Date(),
      user: request.user._id
    });

    // Send success response with created post details
    response.status(201).json({
      message: 'Post created successfully',
      post: {
        id: post._id,
        title: post.title,
        description: post.description,
        picture: post.picture,
        username: post.username,
        createdDate: post.createdDate
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    response.status(500).json({
      message: 'Failed to create post',
      error: error.message
    });
  }
};

 const updatePost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        if (!post) {
            response.status(404).json({ msg: 'Post not found' })
        }
        
        await Post.findByIdAndUpdate( request.params.id, { $set: request.body })

        response.status(200).json('post updated successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // // ✅ Check if ID is a valid MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   console.log("❌ Invalid Post ID:", id);
    //   return res.status(400).json({ message: "Invalid Post ID" });
    // }

    // ✅ Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      console.log("⚠️ Post not found:", id);
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // ✅ Delete the post
    await Post.deleteOne({ _id: id });
    console.log("🗑️ Post deleted successfully:", id);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting post:", error);
    return res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};



const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID was provided
    if (!id) {
      return res.status(400).json({ message: 'Post ID is required.' });
    }

    const post = await Post.findById(id);

    // If no post found with that ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};



const getEveryPosts = async (req, res) => {
  try {
    // Fetch all posts and populate user details (name, username, email)
    const posts = await Post.find().populate("user", "name username email")
          .sort({ createdDate: -1, createdAt : -1 }); // 👈 -1 means descending (latest first)


    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching all posts:", error);
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // ✅ Fetch only posts created by the logged-in user
    const posts = await Post.find({ user: req.user.id })
      .populate("user", "name email") // optional: include user details
      .sort({ createdDate: -1 }); // latest first

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // post id
    const userId = req.user._id; // logged-in user id

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if already liked
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      likedByUser: !isLiked,
    });
  } catch (error) {
    console.error("🔥 Error liking post:", error);
    res.status(500).json({ message: "Failed to like post", error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params; // post ID
    const { text } = req.body; // comment text
    const userId = req.user._id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: userId,
      username: req.user.username,
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({ message: "Comment added successfully", comments: post.comments });
  } catch (error) {
    console.error("🔥 Error adding comment:", error);
    return res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPosts,
    getEveryPosts,
    toggleLike,
    addComment
}

