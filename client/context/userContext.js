import axios from "axios";
import { useRouter } from "next/navigation";
import React,{createContext,useEffect,useState,useContext, Children}from "react";
import toast from "react-hot-toast"

const UserContext=React.createContext();

export const UserContextProvider=({children})=>{

  const serverUrl="http://localhost:8000";

  const router=useRouter()
  const[user,setUser]=useState({});
  const [userState,setUserState]=useState({
    name:"",
    email:"",
    password:"",
  })

  const[loading,setLoading]=useState(true);

  const registerUser=async(e)=>{
    e.preventDefault();
    if(!userState.email.includes("@") || !userState.password || userState.password.length<6 || !userState.name)
    {
        toast.error("Please enter all the details") 
        return;
    }
    try {
        const res=await axios.post(`${serverUrl}/api/v1/register`,userState)
        toast.success("User registered successfully");
        setUserState({
            name:"",
            email:"",
            password:"",
        })
        router.push("/login");
        } catch (error) {
                // Handle duplicate email and other API errors clearly
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    const message = error.response?.data?.message || error.message;
                    if (status === 409 || /exists/i.test(message || "")) {
                        toast.error("Email already registered");
                    } else {
                        toast.error(message || "Error registering user");
                    }
                } else {
                    toast.error("Error registering user");
                }
                console.log("Error registering user", error);
        }
    
  }

//login the user
const loginUser=async(e)=>{
    e.preventDefault();
    try {
        const response=await axios.post(`${serverUrl}/api/v1/login`,{
            email:userState.email,
            password:userState.password,
        },{
            withCredentials:true,
        })
        toast.success("User logged in successfully");
        setUserState({
            name:"",
            password:"",
        })
        router.push('/');
    } catch (error) {
        console.log("Error logging in user",error);
        toast.error(error.response.data.message);
    }
}

//get user looged in status
const userLoginStatus=async()=>{
    let loggedIn=false;
    try {
    const res=await axios.get(`${serverUrl}/api/v1/login-status`,{
        withCredentials:true,
    }) 
    loggedIn=!!res.data
    setLoading(false)
    if(!loggedIn)
    {
        router.push("/login")
    }

    } catch (error) {
        console.log("Error getting user login user status",error)
        
    }
    return loggedIn;
}

//logout user
const logoutUser=async()=>{
    try {
       const res=await axios.get(`${serverUrl}/api/v1/logout`,{
        withCredentials:true,
       }) 
       toast.success("User logged out successfully");
       router.push("/login");

    } catch (error) {
       console.log("Error logging out user",error);
       toast.error(error.response.data.message) 
    }
}

   const handlerUserInput=(name)=>(e)=>{
    const value=e.target.value;

    setUserState((prevState)=>({
        ...prevState,
        [name]:value
    }))
   }

   useEffect(()=>{
    if(userLoginStatus()){
      userLoginStatus();    
    }
   },[]);


    return (
        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
        }}>
        {children}
        </UserContext.Provider>
    )
}


export const useUserContext=()=>{
    return useContext(UserContext);
}