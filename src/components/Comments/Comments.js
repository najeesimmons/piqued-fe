import ErrorView from "../Views/ErrorView";
import PhotogCredit from "../PhotogCredit/PhotogCredit";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import {
  deleteOwnCommnent,
  getCommentsByPexelsId,
  insertComment,
} from "../../../lib/comment/comment";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const commentButtonRef = useRef();

  const getComments = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    const result = await getCommentsByPexelsId(pexels_id);
    if (!result) {
      setIsError(true);
    } else {
      setComments(result);
    }
    setIsLoading(false);
  }, [pexels_id]);

  const handleComment = useCallback(async () => {
    if (!user) {
      setDisableComment(true);
      setIsShowAuthCta(true);
      return;
    }

    if (commentText !== "") {
      setIsCommentError(false);
      const result = await insertComment({ pexels_id, commentText });
      if (!result) {
        setIsCommentError(true);
        return;
      } else {
        setComments((prev) => [result, ...prev]);
      }
      setCommentText("");
    }
    return;
  }, [commentText, pexels_id, setDisableComment, setIsShowAuthCta, user]);

  const handleDeleteComment = useCallback(
    async (id) => {
      if (!user) return;
      const result = await deleteOwnCommnent(id);
      if (!result) {
        return;
      } else {
        setComments((prev) => prev.filter((c) => c.id !== result.id));
      }
    },
    [user]
  );

  useEffect(() => {
    if (!displayPhoto) return;
    getComments();
  }, [displayPhoto, getComments]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (disableComment === true) return;
      if (e.key === "Enter" && commentText !== "") {
        e.preventDefault();
        await handleComment(pexels_id, commentText);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commentText, disableComment, handleComment, pexels_id]);

  if (isLoading) return <>Loading...</>;
  if (isError) return <ErrorView retry={getComments} entity={"commets"} />;
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
          {comments.length === 0 ? (
            <div className="flex flex-grow items-center justify-center">
              <h1 className="mt-4 font-semibold">No comments. Be the first!</h1>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="group border-b pb-1">
                <div className="flex justify-between font-semibold text-xs">
                  <p>{comment.profile.username || comment.display_name}</p>
                  <button
                    aria-label="delete comment"
                    className={`${
                      comment.user_id !== user?.id
                        ? "hidden"
                        : "invisible group-hover:visible"
                    }`}
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <IoCloseSharp size={15} />
                  </button>
                </div>
                <div className="text-sm">{comment.text}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-2">
        <textarea
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border text-base bg-inherit"
          value={commentText}
          onBlur={() => {
            commentButtonRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </div>
      {isCommentError && (
        <p className="mt-3 text-red-500 font-center text-xs">
          There was a problem submitting your comment. Please try again.
        </p>
      )}
      <button
        className="p-2 border md:mb-2 mb-8 mt-2 bg-black text-white hover:bg-gray-700 font-semibold text-sm"
        onClick={handleComment}
        ref={commentButtonRef}
      >
        Comment
      </button>
    </div>
  );
}
