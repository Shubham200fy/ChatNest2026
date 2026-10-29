import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice"
const apiUrl = import.meta.env.VITE_API_URL;

const getMessages = () => {
    let dispatch = useDispatch();
    let {selectedUser} = useSelector((state) => state.user)
    console.log("selectedUser",selectedUser)
    
    useEffect(() => {
        const fetchMessages = async() => {
            try {
                let result = await axios.get(`${apiUrl}/api/message/get/${selectedUser._id}`,
                    {withCredentials:true}
                )
                console.log(result)
                dispatch(setMessages(result.data))
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchMessages()
    },[selectedUser])
}

export default getMessages