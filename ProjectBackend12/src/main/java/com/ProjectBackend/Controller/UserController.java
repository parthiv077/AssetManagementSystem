package com.ProjectBackend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProjectBackend.Service.EmployeeServices;
import com.ProjectBackend.ServiceImpl.AssetServicesImpl;
import com.ProjectBackend.model.asset.AssetClass;
import com.ProjectBackend.model.asset.AssetDeallocationRequest;
import com.ProjectBackend.model.asset.AssetInfoJSON;
import com.ProjectBackend.model.asset.AssetRequest;
import com.ProjectBackend.model.asset.DeallocationRequest;
import com.ProjectBackend.model.asset.UserAssetInfo;
import com.ProjectBackend.model.employee.AdminDashboard;
import com.ProjectBackend.model.employee.Employee;
import com.ProjectBackend.model.employee.UserDashboard;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin("http://localhost:3000")
@RequestMapping("/user")
@RestController
@PreAuthorize("hasRole('USER')")
public class UserController {

	@Autowired
	AssetServicesImpl assetServices;
	
	@Autowired
	EmployeeServices employeeServices;
	
	@GetMapping("/isUser")
	public ResponseEntity<String> checkAdmin(HttpServletRequest request) {
		return new ResponseEntity<String>("USER", HttpStatus.OK);	
	}
	
	@GetMapping("")
	public ResponseEntity<String> testConnection() {
		return new ResponseEntity<String>("Hello", HttpStatus.OK);
	}

	@GetMapping("/getAllClasses")
	public ResponseEntity<List<AssetClass>> getAllClasses() {
		return new ResponseEntity<List<AssetClass>>(assetServices.getAllAssetClasses(), HttpStatus.OK);
	}
	
	@PostMapping("/requestAsset")
	public ResponseEntity<String> requestAsset(@RequestBody AssetRequest request) {
		String status;
		if(!(status = assetServices.addAssetRequest(request)).equals("Success"))										//if requested asset class does not exist it will not allow to add asset request
		{	
			return new ResponseEntity<String>(status,HttpStatus.OK);
		}return new ResponseEntity<String>(status,HttpStatus.OK);
	}
	
	@GetMapping("/getAllAssets/{empId}")
	public ResponseEntity<List<UserAssetInfo>> getAllAssets(@PathVariable String empId){
		return new ResponseEntity<List<UserAssetInfo>>(assetServices.getAllAssetInfoForParticularUser(empId),HttpStatus.OK);
	}
	
	@GetMapping("/filterAsset/{empId}")
	public ResponseEntity<List<UserAssetInfo>> AssetFilter(@PathVariable String empId, @RequestBody AssetInfoJSON filterInfo ){
		return new ResponseEntity<List<UserAssetInfo>>(assetServices.getFilteredAssetInfoForParticularUser(empId,filterInfo),HttpStatus.OK);
	}
	
	@PostMapping("/searchAsset")
	public ResponseEntity<List<UserAssetInfo>> SearchFilter(@RequestBody AssetInfoJSON filterInfo ){
		return new ResponseEntity<List<UserAssetInfo>>(assetServices.getFilteredAssetInfo(filterInfo),HttpStatus.OK);
	}
	
	
	@GetMapping("/getAllRequestedAssets/{empId}")
	public ResponseEntity<List<AssetRequest>> getAllRequestedAssets(@PathVariable String empId){
		return new ResponseEntity<List<AssetRequest>>(assetServices.getAllRequestedAssetInfoForParticularUser(empId),HttpStatus.OK);
	}
	
	@GetMapping("/getAllDeallocationRequests/{empId}")
	public ResponseEntity<List<DeallocationRequest>> getAllDeallocationRequests(@PathVariable String empId){
		return new ResponseEntity<List<DeallocationRequest>>(assetServices.getAllDeallocatoinRequestsInfoForParticularUser(empId),HttpStatus.OK);
	}
	
	@GetMapping("/dashboard/{empId}")
	public ResponseEntity<UserDashboard> getDashboard(@PathVariable String empId){
		return ResponseEntity.ok(assetServices.getUserDashboard(empId));
	}
	
	@GetMapping("/getEmployee/{empId}")
	public ResponseEntity<Employee> getEmployeeDetails(@PathVariable String empId) {
		Employee ret = employeeServices.getEmployee(empId); // if employee with requesteed employeeId not exist than
															// will return 204
		if (ret == null)
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		return new ResponseEntity<Employee>(ret, HttpStatus.OK);
	}
	
	@PostMapping("/deallocationRequest")
	public ResponseEntity<String> deallocationRequest(@RequestBody AssetDeallocationRequest assetDeallocationRequest){
		String status = assetServices.addDeallocationRequest(assetDeallocationRequest);
		if(!status.equals("Success"))
			return new ResponseEntity<String>(status, HttpStatus.NOT_ACCEPTABLE);
		return new ResponseEntity<String>(status, HttpStatus.OK);
	}
}
