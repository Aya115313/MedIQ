import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function AddReview() {
  const [comment, setComment] = useState("");
  const [submittedReview, setSubmittedReview] = useState(null);

  const handleStarClick = (starIndex) => {
    setSubmittedReview({ comment, rating: starIndex });
    setComment("");
  };

  return (
    <div style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <p style={{ marginLeft: "20px", color: "rgb(130, 197, 220)", fontWeight: "bold" }}>
        Add a review
      </p>

      <div style={{ display: "flex", marginLeft: "20px", marginBottom: "10px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            onClick={() => handleStarClick(star)}
            style={{
              cursor: "pointer",
              color: star <= (submittedReview?.rating || 0) ? "rgb(130, 197, 220)" : "#ccc",
              transition: "color 0.2s"
            }}
          />
        ))}
      </div>

      <input
        type="text"
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "calc(20% - 40px)",
          marginLeft: "20px",
          padding: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />
    </div>
  );
}

export default AddReview;
