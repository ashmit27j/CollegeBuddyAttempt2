// Import necessary libraries and components.
// `useEffect`, `useRef`, and `useState` are React hooks for managing side effects, DOM references, and local state.
// `useMessageStore` is a Zustand store for managing message-related actions.
// `Send` and `Smile` are icons from the `lucide-react` library.
// `EmojiPicker` is a component for selecting emojis.
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "../store/useMessageStore";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ match }) => {
    // State variables:
    // `message`: Stores the current message being typed.
    // `showEmojiPicker`: Tracks whether the emoji picker is visible.
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Reference for the emoji picker to detect clicks outside of it.
    const emojiPickerRef = useRef(null);

    // Access the `sendMessage` action from the `useMessageStore`.
    const { sendMessage } = useMessageStore();

    // Function to handle sending a message.
    // Prevents the default form submission behavior and sends the message if it's not empty.
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(match._id, message);
            setMessage(""); // Clear the input field after sending the message.
        }
    };

    // Effect to handle clicks outside the emoji picker.
    // Closes the emoji picker if a click is detected outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
			// Form container for the message input.
			<form onSubmit={handleSendMessage} className="flex relative">
				{/* Button to toggle the emoji picker. */}
				<button
					type="button"
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1D617A] focus:outline-none"
				>
					<Smile size={24} />
				</button>

				{/* Input field for typing a message. */}
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="flex-grow p-4 pl-16 rounded-l-2xl border-2 border-[#ebebeb] 
        focus:outline-none focus:border-[#30a7cf]"
					placeholder="Type a message..."
				/>

				{/* Button to send the message. */}
				<button
					type="submit"
					className="bg-[#1D617A] text-white p-3 rounded-r-2xl px-5
        hover:bg-[#30a7cf] transition-colors focus:outline-none focus:ring-2 focus:ring-[#30a7cf]"
				>
					<Send size={24} />
				</button>

				{/* Emoji picker dropdown. */}
				{showEmojiPicker && (
					<div ref={emojiPickerRef} className="absolute bottom-20 left-4">
						<EmojiPicker
							onEmojiClick={(emojiObject) => {
								setMessage((prevMessage) => prevMessage + emojiObject.emoji);
							}}
						/>
					</div>
				)}
			</form>
		);
};

export default MessageInput;
