import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const getOtherUsers = () => {
    let dispatch = useDispatch();
    let {otherUsers} = useSelector((state) => state.user)
    
    useEffect(() => {
        const fetchUser = async() => {
            try {
                let result = await axios.get(`${apiUrl}/api/user/others`,
                    {withCredentials:true}
                )
                console.log(result)
                dispatch(setOtherUsers(result.data))
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchUser()
    },[])
}

export default getOtherUsers