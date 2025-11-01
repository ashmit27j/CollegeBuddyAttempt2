import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";

const ChatPage = () => {
  const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();
  const {
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useMessageStore();
  const { authUser } = useAuthStore();
  const { id } = useParams();

  const match = matches.find((m) => m?._id === id);

  // Context menu for deleting messages
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });

  // ✅ Run when user & chat ID available
  useEffect(() => {
    if (authUser && id) {
      getMyMatches();
      getMessages(id);
      subscribeToMessages();

      // ✅ Mark as read immediately
      useMessageStore.getState().markAsRead(id);
      useMessageStore.getState().getUnreadCounts();
    }
    return () => unsubscribeFromMessages();
  }, [
    authUser,
    id,
    getMyMatches,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // ✅ Right-click handler for delete menu
  const handleRightClick = (e, messageId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      messageId,
    });
  };

  const handleDeleteMessage = async () => {
    await deleteMessage(contextMenu.messageId);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const closeContextMenu = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  if (isLoadingMyMatches) return <LoadingMessagesUI />;
  if (!match) return <MatchNotFound />;

  return (
    <div
      className="flex flex-col h-screen bg-gray-100 bg-opacity-50"
      onClick={closeContextMenu}
    >
      {/* Header */}
      <Header />

      {/* Chat Container */}
      <div className="flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Chat Header */}
        <div className="flex items-center justify-center mb-4 bg-white rounded-2xl shadow p-3">
          <img
            src={match.image || "/avatar.png"}
            className="w-12 h-12 object-cover rounded-full mr-3 border-2 border-[#1D617A]"
          />
          <h2 className="text-xl font-semibold text-gray-800">{match.name}</h2>
        </div>

        {/* ✅ Chat Background Maintained */}
        <div
          className="flex-grow overflow-y-auto mb-4 rounded-3xl shadow p-4 relative 
          bg-[url('/CollegeBuddy-Chat-bg.png')] bg-cover bg-center bg-no-repeat"
        >
          <div className="flex-grow w-full h-full rounded-xl p-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Start your conversation with {match.name}
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  onContextMenu={(e) => handleRightClick(e, msg._id)}
                  className={`mb-3 ${
                    msg.sender === authUser._id ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                      msg.sender === authUser._id
                        ? "bg-[#1D617A] text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {/* Message content with file support */}
                    {msg.file ? (
                      <div className="flex flex-col gap-2">
                        {msg.file.mimetype?.startsWith("image/") ? (
                          <a
                            href={msg.file.url}
                            target="_blank"
                            rel="noreferrer"
                            download
                          >
                            <img
                              src={msg.file.url}
                              alt={msg.file.filename || "image"}
                              className="max-w-sm w-full h-auto rounded"
                            />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V7l-4-4H6a2 2 0 00-2 2v13a2 2 0 002 2h2"
                                />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {msg.file.filename}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(msg.file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                            <a
                              href={msg.file.url}
                              target="_blank"
                              rel="noreferrer"
                              download={msg.file.filename}
                              className="px-3 py-1 bg-[#1D617A] text-white rounded hover:bg-[#2a93b5]"
                            >
                              Download
                            </a>
                          </div>
                        )}
                        {msg.content && (
                          <div className="mt-2 break-words">{msg.content}</div>
                        )}
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ✅ Context Menu */}
          {contextMenu.visible && (
            <div
              className="fixed bg-white border shadow-lg rounded-md py-1 text-sm z-[9999]"
              style={{
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                minWidth: "130px",
              }}
            >
              <button
                onClick={handleDeleteMessage}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-800"
              >
                Delete Message
              </button>
            </div>
          )}
        </div>

        {/* Message Input */}
        <MessageInput match={match} />
      </div>
    </div>
  );
};

export default ChatPage;

/* Match Not Found */
const MatchNotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <UserX size={64} className="mx-auto text-[#1D617A] mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Match Not Found
      </h2>
      <p className="text-gray-600">
        Oops! It seems this match doesn&apos;t exist or has been removed.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-[#1D617A] text-white rounded hover:bg-[#227591] transition-colors focus:outline-none focus:ring-2 focus:ring-[#30a7cf] inline-block"
      >
        Go Back To Home
      </Link>
    </div>
  </div>
);

/* Loading UI */
const LoadingMessagesUI = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <Loader size={48} className="mx-auto text-[#30a7cf] animate-spin mb-4" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Loading Chat
      </h2>
      <p className="text-gray-600">
        Please wait while we fetch your conversation...
      </p>
      <div className="mt-6 flex justify-center space-x-2">
        <div
          className="w-3 h-3 bg-[#1D617A] rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-3 h-3 bg-[#1D617A] rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 bg-[#1D617A] rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </div>
);
