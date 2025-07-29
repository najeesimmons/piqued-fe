import PhotogCredit from "../PhotogCredit/PhotogCredit";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getCommentsByPexelsId,
  insertComment,
} from "../../../lib/comment/comment";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";

export default function Comments({
  disableComment,
  setDisableComment,
  displayPhoto,
  setIsShowAuthCta,
}) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { pexels_id } = displayPhoto;
  const [isCommentError, setIsCommentError] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getComments = useCallback(async () => {
    setIsLoading(true);
    const result = await getCommentsByPexelsId(pexels_id);
    if (!result) {
      setIsError(true);
    } else {
      setComments(result);
    }
    setIsLoading(false);
  }, [pexels_id]);

  const handleComment = useCallback(
    async ({ pexels_id, text }) => {
      if (!user) {
        setDisableComment(true);
        setIsShowAuthCta(true);
        return;
      }

      if (commentText !== "") {
        setIsCommentError(false);
        const result = await insertComment({ pexels_id, text });
        if (!result) {
          setIsCommentError(true);
          return;
        } else {
          setComments((prev) => [...prev, result]);
        }
        setCommentText("");
      }
      return;
    },

    [commentText, setDisableComment, setIsShowAuthCta, user]
  );

  useEffect(() => {
    if (!displayPhoto) return;
    getComments();
  }, [displayPhoto, getComments]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (disableComment === true) return;
      if ((e.key === "Enter") & (commentText !== "")) {
        await handleComment({ pexels_id, text });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commentText, disableComment, handleComment, pexels_id]);

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="w-full h-[350px] md:h-full mx-auto flex flex-col md:border p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-sm">
          {comments.length} Comments
        </span>
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
        <div className="mt-2 flex-grow overflow-y-auto space-y-2 border-t pt-2 text-sm">
          {comments.map((comment, index) => (
            <div key={index} className="border-b pb-1">
              <div className="font-semibold text-xs">
                {comment.profile.username || comment.display_name}
              </div>
              <div className="text-sm">{comment.text}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2">
        <textarea
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border text-sm"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </div>
      {isCommentError && (
        <p className="mt-3 text-red-500 font-center text-xs">
          There was an submitting your comment. Please try again.
        </p>
      )}
      <button
        className="p-2 border mt-2 bg-black text-white hover:bg-gray-700 font-semibold text-sm"
        onClick={() => handleComment({ pexels_id, text: commentText })}
      >
        Comment
      </button>
    </div>
  );
}
