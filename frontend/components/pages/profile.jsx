
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  // ✅ Fetch profile + posts on load
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const profileRes = await axios.get("https://blog-app1-87fg.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.user);

        // Fetch all posts
        const postsRes = await axios.get("https://blog-app1-87fg.onrender.com/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error.response?.data || error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, []);

  // ✅ Delete post function
  const deletePost = async (postId) => {
    if (!token) {
      alert("You are not authorized. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await axios.delete(`https://blog-app1-87fg.onrender.com/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message || "Post deleted successfully");

      // remove from state without reloading
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };
  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `https://blog-app1-87fg.onrender.com/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update posts list with new like count
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? {
              ...p,
              likes: res.data.likedByUser
                ? [...p.likes, "temp"]
                : p.likes.slice(0, -1),
            }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const handleAddComment = async (postId, text) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to comment");
      return;
    }

    if (!text || text.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `https://blog-app1-87fg.onrender.com/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update comments instantly in UI
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: res.data.comments, newComment: "" }
            : p
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.response?.data?.message || "Failed to add comment");
    }
  };




  // Helper for profile initials
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // ✅ Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ No user found
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger" role="alert">
          User not found. Please login again.
        </div>
      </div>
    );
  }

  // ✅ Render Profile + Posts
  return (
    <section className="container my-5">
      {/* Profile Card */}
      <div className="d-flex justify-content-center mb-5">
        <div
          className="card shadow-lg border-0 rounded-4"
          style={{ width: "22rem" }}
        >
          <div className="card-body text-center shadow-lg">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "80px", height: "80px", fontSize: "28px" }}
            >
              {user.name ? getInitials(user.name) : "👤"}
            </div>
            <h5 className="card-title mb-3">{user.name}</h5>
            <hr />
            <p className="card-text mb-2">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {user.email}
            </p>
           
          </div>
           <Link to="/create" className="btn btn-success mt-3 w-100">
              Create New Post
            </Link>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-4">
        <h3 className="mb-4 text-center">Your Posts</h3>
        {posts.length === 0 ? (
          <p className="text-center text-muted">
            No posts yet. Create your first post!
          </p>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-md-4">
                <div className="card h-100 shadow-sm border-0">

                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-muted">{post.description}</p>
                    {/* //bottom margin 0  */}
                    <div className="mt-3 ">
                      {/* Like and Comment buttons side by side */}
                      <div className="d-flex align-items-center gap-3">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="btn btn-outline-danger d-flex align-items-center"
                        >
                          ❤️ <span className="ms-1">{post.likes?.length || 0}</span>
                        </button>

                        <button
                          className="btn btn-outline-secondary d-flex align-items-center"
                          onClick={() =>
                            setPosts((prev) =>
                              prev.map((p) =>
                                p._id === post._id ? { ...p, showComments: !p.showComments } : p
                              )
                            )
                          }
                        >
                          💬 <span className="ms-1">Comments</span>
                        </button>
                      </div>

                      {/* Comment section (toggle visible) */}
                      {post.showComments && (
                        <div className="mt-3">
                          <ul className="list-unstyled">
                            {post.comments?.length > 0 ? (
                              post.comments.map((c, i) => (
                                <li key={i} className="border-bottom py-1">
                                  <strong>{c.username}:</strong> {c.text}
                                </li>
                              ))
                            ) : (
                              <p className="text-muted small">No comments yet.</p>
                            )}
                          </ul>

                          {/* Input box for new comment */}
                          <div className="d-flex mt-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="form-control me-2"
                              value={post.newComment || ""}
                              onChange={(e) =>
                                setPosts((prev) =>
                                  prev.map((p) =>
                                    p._id === post._id
                                      ? { ...p, newComment: e.target.value }
                                      : p
                                  )
                                )
                              }
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAddComment(post._id, post.newComment)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 ">
                       <button
                      className="btn btn-danger w-100"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete Post
                    </button>
                    <Link to={`/update/${post._id}`} className="btn btn-primary mt-3 w-100" >
                      Update Post
                    </Link>
                    </div>

                   
                  </div>
                  <div className="card-footer bg-transparent text-muted small text-center">
                    {new Date(post.createdDate).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;

