import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Create = () => { 
       const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
    picture: "",
    username: "",
  });
  

  // 🧠 Handle input changes
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // 🧠 Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title || !post.description) {
      toast.error("Please fill in all required fields", { position: "top-right" });
      return;
    }

    const token = localStorage.getItem("token"); // Get JWT token from local storage

    if (!token) {
      toast.error("Please log in to create a post", { position: "top-right" });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/create",
        post,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );

      toast.success(res.data.message || "Post created successfully!", {
        position: "top-right",
      });
       navigate("/profile"); 

      // Reset form
      setPost({
        title: "",
        description: "",
        picture: "",
        username: "",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while creating the post",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center text-primary">Create a New Post</h3>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={post.title}
            onChange={handleChange}
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={post.description}
            onChange={handleChange}
            placeholder="Write something about your post..."
            required
          ></textarea>
        </div>

        
        {/* Submit */}
        <button type="submit" className="btn btn-success w-100">
          Create Post
        </button>
      </form>
      
    </div>
  );
};

export default Create;
