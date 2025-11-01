// client/src/components/MessageInput.jsx
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, Smile, Paperclip, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ match }) => {
  const { sendMessage } = useMessageStore();
  const { authUser } = useAuthStore();

  // Local states
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Send message handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    await sendMessage(match._id, message.trim(), selectedFile?.file);
    setMessage("");
    removeSelectedFile();
  };

  // Handle emoji select
  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  // Handle file selection
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setSelectedFile({ file, previewUrl });
  };

  // Remove file preview
  const removeSelectedFile = () => {
    if (selectedFile?.previewUrl) URL.revokeObjectURL(selectedFile.previewUrl);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mt-1">
      {/* Emoji Picker Dropdown */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-16 left-3 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      {/* File Preview Box */}
      {selectedFile && (
        <div className="absolute -top-20 left-0 right-0 bg-white rounded-lg shadow p-2 flex items-center gap-3">
          {selectedFile.previewUrl ? (
            <img
              src={selectedFile.previewUrl}
              alt="preview"
              className="w-16 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-12 flex items-center justify-center bg-gray-100 rounded">
              <Paperclip />
            </div>
          )}
          <div className="flex-1 truncate">
            <div className="text-sm font-medium">{selectedFile.file.name}</div>
            <div className="text-xs text-gray-500">
              {(selectedFile.file.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <button
            type="button"
            onClick={removeSelectedFile}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <X />
          </button>
        </div>
      )}

      {/* Main Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-sm px-3 py-2"
      >
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((s) => !s)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
        >
          <Smile className="h-5 w-5 text-gray-600" />
        </button>

        {/* File Upload (next to emoji) */}
        <label className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer">
          <Paperclip className="h-5 w-5 text-gray-600" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={onFileChange}
          />
        </label>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${match.name}...`}
          className="flex-1 h-10 px-3 text-gray-800 placeholder-gray-400 border-none focus:ring-0 bg-transparent"
        />

        {/* Send Button */}
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 bg-[#1D617A] hover:bg-[#227591] text-white rounded-full transition"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
