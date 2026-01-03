"use client";
import axios from "axios";
import { useRouter } from "next/navigation";


import React,{createContext,useEffect,useState,useContext, Children}from "react";
import toast from "react-hot-toast"

const UserContext=React.createContext();

axios.defaults.withCredentials=true


export const UserContextProvider=({children})=>{

  const serverUrl="http://localhost:8000";

  const router=useRouter()
  const[user,setUser]=useState({});
  const[allUsers,setAllUsers]=useState([])
  const [userState,setUserState]=useState({
    name:"",
    email:"",
    password:"",
  })

  const[loading,setLoading]=useState(false);

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
        await getUser();
        toast.success("User logged in successfully");
         setUserState({
            email:"",
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
    

    } catch (error) {
        console.log("Error getting user login user status",error)
        setLoading(false)
        
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


const getUser=async ()=>{
    setLoading(true)
    try {
        const res=await axios.get(`${serverUrl}/api/v1/profile`,{
            withCredentials:true,
        });
        setUser((prevState)=>{
            return {
                ...prevState,
                ...res.data,
            }
        })
        setLoading(false)
    } catch (error) {
        console.log("Error getting  user",error);
        setLoading(false)
       toast.error(error.response.data.message) 
    }
}

//update user
const updateUser=async(e,data)=>{
   
    e.preventDefault();
    setLoading(true)

    try {
      const res=await axios.patch(`${serverUrl}/api/v1/user`,data,{
        withCredentials:true,
      })
      setUser((prevState)=>{
        return {
            ...prevState,
            ...res.data,
        }
      })
      toast.success("User updated successfully")
      setLoading(false)
    } catch (error) {
        console.log("Error updating user details",error)
        setLoading(false)
        toast.error(error.response.data.message)
    }
}

const emailVerification=async()=>{
    setLoading(true)
    try {
        const res=axios.post(`${serverUrl}/api/v1/verify-email`,{},
    {
        withCredentials:true,
    })
    toast.success("Email verification sent successfully")
    setLoading(false)
    } catch (error) {
        console.log("Error in email verification",error)
        toast.error(error.response.data.message)
    }
}

const verifyUser=async(token)=>{
    setLoading(true)
    try {
        const res=await axios.post(`${serverUrl}/api/v1/verify-user/${token}`,{},{
            withCredentials:true,
        })
        toast.success('Account verified')
        getUser(

        )
        router.push('/')


    } catch (error) {
        console.log("Error verifiying user",error)
        toast.error(error.response.data.message)
        setLoading(false)
    }
}

const forgotPasswordEmail=async(email)=>{
     setLoading(true)
     try {
        const res=await axios.post(`${serverUrl}/api/v1/forgot-password`,{email},{
            withCredentials:true,
        })
        toast.success("Forgot password email sent successfully")

        setLoading(false);
        
     } catch (error) {
        console.log("Error sending forgot password email",error)
        toast.error(error.response.data.message)
        setLoading(false)
     }
}

const resetPassword=async(token,password)=>{
    setLoading(true);
    try {
       const res=await axios.post(`${serverUrl}/api/v1/reset-password/${token}`,{password},
        {
            withCredentials:true,
        })
        toast.success("Password Reset Successfully")
        router.push("/login")
        setLoading(false)
        
    } catch (error) {
        console.log("Error in reseting password",error)
        toast.error(error.response.data.message)
        setLoading(false)
    }

}

const changePassword=async(currentPassword,newPassword)=>{
   setLoading(true);
   try {
    const res=await axios.patch(`${serverUrl}/api/v1/change-password`,{
        currentPassword,newPassword
    },
     {
        withCredentials:true
     }
)
   toast.success("Password changed succesfully");
   setLoading(false)

   } catch (error) {
     console.log("Change password error:", error);
     toast.error(error.response.data.message);
     setLoading(false)
}

}

const fetchAllUsers=async()=>{
    setLoading(true)
    try {
        const res=await axios.get(`${serverUrl}/api/v1/admin/users`,{
            withCredentials:true
        })
        setAllUsers(res.data)
    } catch (error) {
        console.log("Get all users error:", error);
        toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
        setLoading(false)
    }
}




   const handlerUserInput=(name)=>(e)=>{
    const value=e.target.value;

    setUserState((prevState)=>({
        ...prevState,
        [name]:value
    }))
   }

     const deleteUser=async(id)=>{
        setLoading(true)
        try {
            await axios.delete(`${serverUrl}/api/v1/admin/users/${id}`,{
                withCredentials:true,
            }) 
            toast.success("User deleted successfully")
            await fetchAllUsers()
        } catch (error) {
             console.log("Deleting user error:", error);
         toast.error(error.response?.data?.message || "Error deleting user");
        } finally {
                setLoading(false)
        }
     }

   useEffect(()=>{
    const loginStatusGetUser=async()=>{
        const isLoggedIn=await userLoginStatus()

        if(isLoggedIn){
            getUser();
        }
    }
    loginStatusGetUser()
    
   },[]);

    useEffect(()=>{
     if(user.role==='admin'){
         fetchAllUsers();
     }
    
    },[user.role])


    return (

        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
            getUser,
            userLoginStatus,
            user,
            updateUser,
            emailVerification,
            verifyUser,
            forgotPasswordEmail,
            resetPassword,
            changePassword,
            fetchAllUsers,
            allUsers,
            deleteUser,

        }}>
        {children}
        </UserContext.Provider>
    )
}


export const useUserContext=()=>{
    return useContext(UserContext);
}