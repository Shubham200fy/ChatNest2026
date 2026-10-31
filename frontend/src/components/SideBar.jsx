import { useSelector, useDispatch } from "react-redux";
import { setSearchData, setSelectedUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL

const SideBar = () => {
  let [input, setInput] = useState('')
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const { userData, otherUsers, onlineUsers, searchData } = useSelector(
    (state) => state.user
  );

  const handleSearch = async () => {
    try {
      let result = await axios.get(`${apiUrl}/api/user/search?query=${input}`, { withCredentials: true })
      dispatch(setSearchData(result.data))

      console.log(result)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (input) {
      handleSearch()
    }
  }, [input])
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden border-r border-slate-200 bg-white relative">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/chatnest.png"
            alt="ChatNest"
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />
          <h1 className="truncate text-xl font-bold text-slate-800 sm:text-2xl">
            ChatNest
          </h1>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <span className="text-2xl">⋮</span>
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pb-4 sm:px-4">
        <input
          type="search"
          placeholder="Search or start a new chat"
          className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
      </div>

      {input.length > 0 && <div className="flex p-3  w-[100vw] h-[100vh] bg-[white]  flex-col gap-[10px] absolute top-[140px] z-50">
        {searchData?.map((user) => (
          <div>
            <button
              key={user._id}
              type="button"
              onClick={() =>{
                dispatch(setSelectedUser(user))
                setInput('')
              }}
              className="flex w-[330px] items-center gap-3 rounded-[20px] px-3 py-3 text-left transition hover:bg-emerald-100"
            >
              <div className="relative">
                <img
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || user.userName || "User"}
                  className="h-11 w-11 shrink-0 rounded-full bg-slate-100 object-cover sm:h-12 sm:w-12"
                />
                {onlineUsers?.includes(user._id) && <span className="w-[11px] h-[11px] rounded-full bg-emerald-400 absolute bottom-[0px] right-[0px]"></span>}

              </div>
              <div className="min-w-0 flex-1  pb-3">
                <h4 className="truncate font-semibold text-slate-800">
                  {user.name || user.userName}
                </h4>
                <p className="mt-1 truncate text-sm text-slate-500">
                  Start a conversation
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>}

      {/* Friends */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent chats
        </h3>

        {otherUsers?.map((user) => (

          <button
            key={user._id}
            type="button"
            onClick={() => dispatch(setSelectedUser(user))}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
          >
            <div className="relative">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name || user.userName || "User"}
                className="h-11 w-11 shrink-0 rounded-full bg-slate-100 object-cover sm:h-12 sm:w-12"
              />
              {onlineUsers?.includes(user._id) && <span className="w-[11px] h-[11px] rounded-full bg-emerald-400 absolute bottom-[0px] right-[0px]"></span>}

            </div>
            <div className="min-w-0 flex-1 border-b border-slate-100 pb-3">
              <h4 className="truncate font-semibold text-slate-800">
                {user.name || user.userName}
              </h4>
              <p className="mt-1 truncate text-sm text-slate-500">
                Start a conversation
              </p>
            </div>
          </button>

        ))}

        {otherUsers?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No friends found
          </p>
        )}
      </div>

      {/* Current user */}
      <div className=" cursor-pointer flex shrink-0 items-center gap-3 border-t border-slate-200 p-3 sm:p-4"
        onClick={() => navigate('/profile')}>
        <img
          src={userData?.image || "/default-avatar.png"}
          alt="My profile"
          className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover sm:h-11 sm:w-11"
        />

        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-800">
            {userData?.name || userData?.userName || "My Profile"}
          </h4>
          <p className="text-xs text-emerald-600">Online</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;