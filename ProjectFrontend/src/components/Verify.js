import axios from "axios";

export const fetchAdminAuth = async (navigate) => {
  
    try{
      const token = localStorage.getItem("token");
      const response = await axios.get("/user/isUser",{ headers : {Authorization : `Bearer ${token}`}});
      // console.log("response.data => ",response.data);
      
      if(response.data === "USER"){
        navigate("/userdashboard")
      }
      else if(response.status === 401){
        navigate("/")
      }
  
    }catch(error) {
      console.log(error);
    }

  }     

  export const fetchUserAuth = async (navigate) => {
    try{
      const token = localStorage.getItem("token");
      const response = await axios.get("/admin/isAdmin", {headers : {Authorization : `Bearer ${token}`}});
      // console.log("response.data => ",response.data);
      
      if(response.data === "ADMIN"){
        navigate("/admindashboard")
      }
      else if(response.status === 403){
        navigate("/")
      }
  
    }catch(error) {
      console.log(error);
    }
  }     
