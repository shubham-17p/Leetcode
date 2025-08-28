import {Routes, Route,Navigate } from "react-router";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import {checkAuth} from "./authSlice";
import {useSelector, useDispatch} from "react-redux";
import { useEffect } from "react";
function App(){

  // code likhna isAuthentciated
    const {isAuthenticated,user,loading} =  useSelector((state)=>state.auth);
    const dispatch = useDispatch();
  
  
    useEffect(()=>{
      dispatch(checkAuth())
    },[dispatch]);
    
    if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return(
    <>
    <Routes>
        <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
        <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route>



    </Routes>
    </>
  )
}

export default App;