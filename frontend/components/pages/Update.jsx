import React, { useState, useEffect } from "react";
import axios from "axios";
import {ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // ✅ Add this line

import { useParams, useNavigate } from "react-router-dom";

const Update = () => {
  const { id } = useParams(); // ✅ Get post ID from URL (/update/:id)
  console.log("🆔 ID from params:", id);

  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
  });

  // ✅ Fetch existing post to prefill form
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login to continue");
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5000/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setPost({
            title: res.data.title || "",
            description: res.data.description || "",
          });
        } else {
          toast.error("Post not found");
        }
      } catch (error) {
        console.error("❌ Error fetching post:", error);
        toast.error(error.response?.data?.message || "Failed to load post details");
      }
    };

    fetchPost();
  }, [id, navigate]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // ✅ Handle update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title.trim() || !post.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/update/${id}`,
        post,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "✅ Post updated successfully!",{
        position: "top-right",
      });
      navigate("/profile"); // redirect after success
    } catch (error) {
      console.error("❌ Error updating post:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while updating the post"
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4 text-center text-primary">Update Post</h3>

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
          Update Post
        </button>
      </form>
            <ToastContainer />

    </div>
  );
};

export default Update;
