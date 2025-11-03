
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // stored at login
  const token = localStorage.getItem("token");

  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllPosts = async () => {

      if (!token) {
        alert("No token found. Please login.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // ✅ Fetch user profile
        const profileRes = await axios.get("https://blog-app1-87fg.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data.user);

        // ✅ Fetch all posts (populated with user info)
        const res = await axios.get("https://blog-app1-87fg.onrender.com/allposts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else {
          console.error("⚠ Unexpected response format:", res.data);
          setPosts([]);
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error.response?.data || error);
        alert(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);


  // ✅ Function to handle like/unlike
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



  // // ✅ Group posts by user (based on user.name)
  // const groupedPosts = posts.reduce((acc, post) => {
  //   const author = post.user?.name || post.username || "Unknown User";
  //   if (!acc[author]) acc[author] = [];
  //   acc[author].push(post);
  //   return acc;
  // }, {});

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
return (
    <section className="container my-5">
     <div className="text-center mb-4">
         <h2 className="fw-bold">📚 All Users’ Posts</h2>
         <p className="text-muted">Explore posts from all users of the platform.</p>
         <Link to="/create" className="btn btn-success mt-2">
           + Create New Post
         </Link>
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
                    <p className="card-text mb-2 mt-3">
                         <strong>Author:</strong> {post.user?.username || "Unknown User"}
                       </p>
                 

                   
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

  // return (
  //   <section className="container my-5">
  //     <div className="text-center mb-4">
  //       <h2 className="fw-bold">📚 All Users’ Posts</h2>
  //       <p className="text-muted">Explore posts from all users of the platform.</p>
  //       <Link to="/create" className="btn btn-success mt-2">
  //         + Create New Post
  //       </Link>
  //     </div>

  //     {Object.keys(groupedPosts).length === 0 ? (
  //       <p className="text-center text-muted">No posts available yet.</p>
  //     ) : (
  //       Object.entries(groupedPosts).map(([author, userPosts]) => (
  //         <div key={author} className="mb-5">
  //           {/* <h4 className="text-primary mb-3">{author}’s Posts</h4> */}
  //           <div className="row g-4">
  //             {userPosts.map((post) => (
  //               <div key={post._id} className="col-md-4">
  //                 <div className="card h-100 shadow-sm border-0">
  //                   <div className="card-body">
  //                     <h5 className="card-title">{post.title || "Untitled"}</h5>

  //                     <p className="card-text text-muted">
  //                       {post.description || "No description provided."}
  //                     </p>
  //                     <div className="card-footer bg-transparent text-muted small text-center">
  //                       {new Date(post.createdDate).toLocaleString()}
  //                     </div>
  //                     <p className="card-text mb-2">
  //                       <strong>Author:</strong> {post.user?.username || "Unknown User"}
  //                     </p>


  //                     {/* ✅ COMMENTS SECTION */}
  //                     <div className="mt-3">
  //                       {/* Like and Comment buttons side by side */}
  //                       <div className="d-flex align-items-center gap-3">
  //                         <button
  //                           onClick={() => handleLike(post._id)}
  //                           className="btn btn-outline-danger d-flex align-items-center"
  //                         >
  //                           ❤️ <span className="ms-1">{post.likes?.length || 0}</span>
  //                         </button>

  //                         <button
  //                           className="btn btn-outline-secondary d-flex align-items-center"
  //                           onClick={() =>
  //                             setPosts((prev) =>
  //                               prev.map((p) =>
  //                                 p._id === post._id ? { ...p, showComments: !p.showComments } : p
  //                               )
  //                             )
  //                           }
  //                         >
  //                           💬 <span className="ms-1">Comments</span>
  //                         </button>
  //                       </div>

  //                       {/* Comment section (toggle visible) */}
  //                       {post.showComments && (
  //                         <div className="mt-3">
  //                           <ul className="list-unstyled">
  //                             {post.comments?.length > 0 ? (
  //                               post.comments.map((c, i) => (
  //                                 <li key={i} className="border-bottom py-1">
  //                                   <strong>{c.user?.username || c.username || "Unknown User"}:</strong> {c.text}
  //                                 </li>
  //                               ))
  //                             ) : (
  //                               <p className="text-muted small">No comments yet.</p>
  //                             )}
  //                           </ul>

  //                           {/* Input box for new comment */}
  //                           <div className="d-flex mt-2">
  //                             <input
  //                               type="text"
  //                               placeholder="Write a comment..."
  //                               className="form-control me-2"
  //                               value={post.newComment || ""}
  //                               onChange={(e) =>
  //                                 setPosts((prev) =>
  //                                   prev.map((p) =>
  //                                     p._id === post._id
  //                                       ? { ...p, newComment: e.target.value }
  //                                       : p
  //                                   )
  //                                 )
  //                               }
  //                             />
  //                             <button
  //                               className="btn btn-primary"
  //                               onClick={() => handleAddComment(post._id, post.newComment)}
  //                             >
  //                               Post
  //                             </button>
  //                           </div>
  //                         </div>
  //                       )}
  //                     </div>




  //                   </div>

  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       ))
  //     )}
  //   </section>
  // );
};

export default Home;

