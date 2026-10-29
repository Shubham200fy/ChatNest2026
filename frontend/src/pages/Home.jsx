import { useState } from "react";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import { useSelector } from "react-redux";
import getMessage from "../customHooks/getMessages"

const Home = () => {
  const {selectedUser} = useSelector(state=> state.user)
  // const [selectedUser, setSelectedUser] = useState(null);
  getMessage()
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`h-full w-full shrink-0 md:block md:w-[320px] lg:w-[360px] ${
          selectedUser ? "hidden" : "block"
        }`}
      >
        <SideBar  />
      </div>

      {/* Message area */}
      <div
        className={`h-full min-w-0 flex-1 ${
          selectedUser ? "flex" : "hidden md:flex"
        }`}
      >
        <MessageArea />
      </div>
    </div>
  );
};

export default Home;