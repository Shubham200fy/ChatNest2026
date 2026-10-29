import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
const apiUrl = import.meta.env.VITE_API_URL;

const getCurrentUser = () => {
    let dispatch = useDispatch();
    let {userData} = useSelector((state) => state.user)
    
    useEffect(() => {
        const fetchUser = async() => {
            try {
                let result = await axios.get(`${apiUrl}/api/user/current`,
                    {withCredentials:true}
                )
                console.log(result)
                dispatch(setUserData(result.data.user))
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser