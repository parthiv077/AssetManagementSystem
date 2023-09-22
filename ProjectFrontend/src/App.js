import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/users/UserDashboard';
import { AuthProvider } from './components/Auth';
import {RequireAuth} from './components/RequireAuth'
import AddEmployee from './pages/admin/AddEmployee'
import FirstTimeLogin from './pages/users/FirstTimeLogin';
import Request from './pages/admin/Request';
import AddAsset from './pages/admin/AddAsset';
import AddAssetClass from './pages/admin/AddAssetClass';
import CustomClass from './pages/admin/CustomClass';
import AssetList from './pages/admin/AssetList';
import EmployeeList from './pages/admin/EmployeeList';
import Success from './pages/users/Success';
import AcquiredAssets from './pages/users/AcquiredAssets';
import MakeRequest from './pages/users/MakeRequest';
import ChooseAsset from './pages/users/ChooseAsset';
import SearchAsset from './pages/users/SearchAsset'
import RequestedAssets from './pages/users/RequestedAssets';
import AdminProfile from './pages/admin/AdminProfile';
import UserProfile from './pages/users/UserProfile';
import Deallocate from './pages/users/Deallocate';
import Deallocation from './pages/admin/Deallocation'
function App() {
  return (

      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admindashboard" element={<AdminDashboard/>}/>
          <Route path="/userdashboard" element={<UserDashboard/>}/>
          <Route path="/addemployee" element={<AddEmployee/>}/>
          <Route path="/userlogin/:token" element={<FirstTimeLogin/>}/>
          <Route path="/addassetclass" element={<AddAssetClass/>}/>
          <Route path="/addassetclass/addasset" element={<AddAsset/>}/>
          <Route path="/addassetclass/customclass" element={<CustomClass/>}/>
          <Route path="/assetlist" element={<AssetList/>}/>
          <Route path="/request" element={<Request/>}/>
          <Route path="/employee" element={<EmployeeList/>}/>
          <Route path="/successfull" element={<Success/>}/>
          <Route path="/acquiredassets" element={<AcquiredAssets/>}/>
          <Route path="/makerequest" element={<MakeRequest/>}/>
          <Route path="/makerequest/chooseasset" element={<ChooseAsset/>}/>
          <Route path="/makerequest/chooseasset/searchasset" element={<SearchAsset/>}/>
          <Route path="/requestedassets" element={<RequestedAssets/>}/>
          <Route path="/adminprofile" element={<AdminProfile/>}/>
          <Route path="/userprofile" element={<UserProfile/>}/>
          <Route path="/deallocateasset" element={<Deallocate/>}/>
          <Route path="/requestfordeallocation" element={<Deallocation/>}/>







        </Routes>
        </AuthProvider>
      </Router>
  
  );
}

export default App;
