import { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PhotogCredit from "../PhotogCredit/PhotogCredit";
import {
  getCommentsByPexelsId,
  insertComment,
} from "../../../lib/comment/comment";

export default function Comments({ displayPhoto }) {
  const [isOpen, setIsOpen] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { pexels_id } = displayPhoto;

  const getComments = useCallback(async () => {
    const { data, error } = await getCommentsByPexelsId(pexels_id);
    if (error) return;
    setComments(data);
  }, [pexels_id]);

  useEffect(() => {
    if (!displayPhoto) return;
    getComments();
  }, [displayPhoto, getComments]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  const handleSubmitCommet = async ({ pexels_id, text }) => {
    if (commentText === "") return;
    const { success, data, error } = await insertComment({ pexels_id, text });
    if (error) return;
    if (success === true && data) {
      setComments((prev) => [...prev, data[0]]);
    }
  };

  return (
    <div className="w-full h-[350px] md:h-full mx-auto flex flex-col md:border p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{comments.length} Comments</span>
        {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
      </div>
      {displayPhoto && (
        <PhotogCredit
          name={displayPhoto.photographer}
          pexelPhotogPageUrl={displayPhoto.photographer_url}
          pexelShowPageUrl="https://www.pexels.com"
        />
      )}

      {isOpen && (
        <div className="mt-2 flex-grow overflow-y-auto space-y-2 border-t pt-2">
          {comments.map((comment, index) => (
            <div key={index} className="border-b pb-1">
              {comment.text}
            </div>
          ))}
        </div>
      )}

      {/* Input Field (Sticky to Bottom) */}
      <div className="mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </div>
      <button
        onClick={() => handleSubmitCommet({ pexels_id, text: commentText })}
      >
        Comment
      </button>
    </div>
  );
}
