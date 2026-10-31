import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import { FaImages } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { IoSendSharp } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react"
import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;
import { setMessages } from "../redux/messageSlice"
import RecieverMessage from "./RecieverMessage";
import SenderMessage from "./SenderMessage"

const MessageArea = () => {
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  let [showPicker, setShowPicker] = useState(false)
  const { selectedUser, userData, socket, onlineUsers } = useSelector((state) => state.user);
  const { messages } = useSelector(state => state.message)
  console.log("messages", messages)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() && !backendImage) {
      return;
    }
    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(`${apiUrl}/api/message/send/${selectedUser._id}`, formData,
        { withCredentials: true }
      )
      dispatch(setMessages([...messages, result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (err) {
      console.log(err)
    }
  }
  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
    setShowPicker(false)
  }
  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      dispatch(setMessages([...messages, mess]));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, setMessages]);
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [messages]);
  // Show a placeholder when no user is selected
  if (!selectedUser) {
    return (
      <section className="hidden h-full min-w-0 flex-1 flex-col items-center justify-center bg-[#f0f2f5] md:flex">
        <div className="flex max-w-md flex-col items-center px-6 text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
            {/* <i className="fa-solid fa-comments text-4xl text-emerald-600"></i> */}
            <img src="chatnest.png" alt="" className="w-[70px]" />
          </div>

          <h2 className="text-2xl font-semibold text-slate-700">
            Welcome to ChatNest
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Select a friend from your chat list to start a conversation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className=" relative flex h-full min-w-0 flex-1 flex-col bg-[#efeae2]">

      {/* Chat header */}
      <header className="flex h-[68px] shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:h-[75px] sm:px-5">

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => dispatch(setSelectedUser(null))}
            aria-label="Back to chats"
            className="shrink-0 rounded-full p-2 text-slate-700 transition hover:bg-slate-100 "
          >
            <FaArrowLeftLong size={21} />
          </button>

          <img
            src={selectedUser.image || "/default-avatar.png"}
            alt={selectedUser.name || selectedUser.userName || "Friend"}

            className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover sm:h-11 sm:w-11"
          />

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              {selectedUser.name || selectedUser.userName || "Friend"}
            </h2>

            <p className="text-xs text-emerald-600">
              {onlineUsers?.includes(selectedUser._id)? "Online":"Offline"}
            </p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex shrink-0 items-center gap-0.5 text-slate-800 sm:gap-2">

          <button
            type="button"
            aria-label="Video call"
            className="rounded-full p-2 hover:bg-slate-100 sm:p-2.5"
          >
            <FaVideo size={22} />
          </button>

          <button
            type="button"
            aria-label="Voice call"
            className="hidden rounded-full p-2.5 hover:bg-slate-100 sm:block"
          >
            <FaPhoneAlt size={20} />
          </button>

          <button
            type="button"
            aria-label="Search messages"
            className="rounded-full p-2 hover:bg-slate-100 sm:p-2.5"
          >
            <FaSearch size={21} />
          </button>

          <button
            type="button"
            aria-label="More options"
            className="rounded-full p-2 hover:bg-slate-100 sm:p-2.5"
          >
            <HiDotsVertical size={20} />
          </button>
        </div>
      </header>

      {/* Emoji popup */}
      {showPicker &&
        <div className="absolute bottom-[71px] left-[20px]">
          <EmojiPicker width={350} height={400}
            className="shadow-lg" onEmojiClick={onEmojiClick} />
        </div>
      }
      {/* Messages */}
      <div
        className=" min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:space-y-4 sm:px-6 sm:py-6"
        style={{
          backgroundImage:
            "radial-gradient(#d6d0c7 0.7px, transparent 0.7px)",
          backgroundSize: "18px 18px",
        }}
      >

        <div className="mx-auto w-fit rounded-lg bg-white/90 px-4 py-1.5 text-xs text-slate-500 shadow-sm">
          Today
        </div>

        {messages?.map((mess) => (
          mess.sender == userData._id ? <SenderMessage image={mess.image} message={mess.message} 
            profileImage={userData.image}
          /> :
            <RecieverMessage image={mess.image} message={mess.message} 
              profileImage={selectedUser?.image}
            />
        ))}


         <div ref={messagesEndRef} />  
      </div>


      {/* Message composer */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" flex shrink-0 items-center gap-1.5 border-t border-slate-200 bg-white px-2 py-2.5 sm:gap-3 sm:px-5 sm:py-3"
      >
        <img src={frontendImage} alt="" className="w-[200px] absolute bottom-[70px] right-[40px]" />
        <button
          type="button"
          aria-label="Emoji"
          className="rounded-full p-2 text-slate-800 hover:bg-slate-100 "
          onClick={() => setShowPicker(prev => !prev)}
        >

          <BsFillEmojiSunglassesFill size={21} />
          {/* <i className="fa-regular fa-face-grin"></i> */}
        </button>

        <button
          type="button"
          aria-label="Attach file"
          className="rounded-full p-2 text-slate-800 hover:bg-slate-100 w-[40px]"
          onClick={() => image.current.click()}
        >
          <FaImages size={23} />
        </button>
        <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />
        <input
          type="text"
          placeholder="Type a message..."
          aria-label="Type a message"
          className="min-w-0 flex-1 rounded-full bg-slate-100 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-100 sm:px-5"
          onChange={(e) => setInput(e.target.value)} value={input}

        />

        <button
          type="submit"
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 sm:h-11 sm:w-11"
          onClick={handleSendMessage}
        >
          <IoSendSharp size={21} />
        </button>
      </form>
    </section>
  );
};

export default MessageArea;
