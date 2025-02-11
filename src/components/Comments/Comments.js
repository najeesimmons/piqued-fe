import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PhotogCredit from "../PhotogCredit/PhotogCredit";

export default function Comments({ name, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const comments = [
    "great",
    "bad",
    "just fine",
    "mid",
    "stinks",
    "rocks",
    "great",
    "bad",
    "just fine",
    "mid",
    "stinks",
    "rocks",
  ];

  return (
    <div className="w-full h-[350px] md:h-full mx-auto flex flex-col border p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{comments.length} Comments</span>
        {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
      </div>
      <PhotogCredit name={name} url={url} />
      {/* Scrollable Comments List */}
      {isOpen && (
        <div className="mt-2 flex-grow overflow-y-auto space-y-2 border-t pt-2">
          {comments.map((comment, index) => (
            <div key={index} className="border-b pb-1">
              {comment}
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
        />
      </div>
    </div>
  );
}
