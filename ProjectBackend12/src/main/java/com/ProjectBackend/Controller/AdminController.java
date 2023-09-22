package com.ProjectBackend.Controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProjectBackend.Service.AssetServices;
import com.ProjectBackend.Service.EmployeeServices;
import com.ProjectBackend.auth.RegisterRequest;
import com.ProjectBackend.model.asset.AcceptAssetResponse;
import com.ProjectBackend.model.asset.AddAssetClassInfo;
import com.ProjectBackend.model.asset.AssetInfoJSON;
import com.ProjectBackend.model.asset.AssetClass;
import com.ProjectBackend.model.asset.ExcelObj;
import com.ProjectBackend.model.asset.AssetInfo;
import com.ProjectBackend.model.asset.AssetRequest;
import com.ProjectBackend.model.asset.DeallocationRequest;
import com.ProjectBackend.model.asset.DeallocationRequestWithAttributes;
import com.ProjectBackend.model.asset.DeleteAssetResponse;
import com.ProjectBackend.model.employee.AdminDashboard;
import com.ProjectBackend.model.employee.Employee;
import com.graphbuilder.math.func.FloorFunction;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@CrossOrigin("http://localhost:3000")
@RequestMapping("/admin")
@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

	private final AssetServices assetServices;
	private final EmployeeServices employeeServices;

	@GetMapping("")
	public ResponseEntity<String> testConnection() {
		System.out.println();
		return new ResponseEntity<String>("Hello ", HttpStatus.OK);
	}

	@GetMapping("/assetKeys/{name}")
	public ResponseEntity<AssetClass> provideKeys(@PathVariable String name) {
		AssetClass ret = assetServices.getAssetClass(name);
		if (ret == null) // If there is no class found with the requested name than it will return 404
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		return new ResponseEntity<AssetClass>(ret, HttpStatus.OK);
	}

	@GetMapping("/assetClassExcel/{className}")
	public ResponseEntity<byte[]> provideAssetExcel(@PathVariable String className) throws IOException {
		Workbook workbook = assetServices.createExcelAccordingToClass(className);
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			workbook.write(bos);
		} finally {
			bos.close();
		}
		byte[] returnValue = bos.toByteArray();

		return new ResponseEntity<byte[]>(returnValue, HttpStatus.OK);
	}

	@PostMapping("/addAsset")
	public ResponseEntity<HttpStatus> addAsset(@RequestBody AssetInfoJSON assetInfo) {
		if (!assetServices.insertNewAsset(assetInfo)) // if there is no asset class present as requested then will
														// return 404
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	////////to change here
	
	@PostMapping("/addAssetExcel")
	public ResponseEntity<HttpStatus> addAssetByExcel(@RequestBody ExcelObj assetExcel) {
		if (!assetServices.insertNewAssetExcel(assetExcel)) // if there is no asset class present as requested then will
														// return 404
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
//	public ResponseEntity<String>

	@PostMapping("/addAssetClass")
	public ResponseEntity<HttpStatus> addAssetClass(@RequestBody AddAssetClassInfo assetClassInfo) {
		if (!assetServices.insertNewAssetClass(assetClassInfo)) // if class is already present with the name than will
																// return 409
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/getAllClasses")
	public ResponseEntity<List<AssetClass>> getAllClasses() {
		return new ResponseEntity<List<AssetClass>>(assetServices.getAllAssetClasses(), HttpStatus.OK);
	}

	@GetMapping("/getAllAssets")
	public ResponseEntity<List<AssetInfo>> getAllAssets() {
		return new ResponseEntity<List<AssetInfo>>(assetServices.getAllAssetsInfo(), HttpStatus.OK);
	}

	@GetMapping("/filterAsset")
	public ResponseEntity<List<AssetInfo>> AssetFilter(@RequestBody AssetInfoJSON filter) {
		return new ResponseEntity<List<AssetInfo>>(assetServices.getAssetInfoByNameAndAttribuesHaving(filter),
				HttpStatus.OK);
	}

	@PostMapping("/addEmployee")
	public ResponseEntity<Employee> addEmployee(@Valid @RequestBody RegisterRequest employee) {
		Employee ret = employeeServices.addNewEmployee(employee); // if employee with same employeeID already exist than
																	// will return 409
		if (ret != null)
			return new ResponseEntity<Employee>(ret, HttpStatus.OK);
		return new ResponseEntity<>(HttpStatus.CONFLICT);
	}

	@GetMapping("/getEmployee/{empId}")
	public ResponseEntity<Employee> getEmployeeDetails(@PathVariable String empId) {
		Employee ret = employeeServices.getEmployee(empId); // if employee with requesteed employeeId not exist than
															// will return 204
		if (ret == null)
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		return new ResponseEntity<Employee>(ret, HttpStatus.OK);
	}

	@GetMapping("/getAllEmployees")
	public ResponseEntity<List<Employee>> getAllEmployees() {
		return new ResponseEntity<List<Employee>>(employeeServices.getAllEmployees(), HttpStatus.OK);
	}

	@GetMapping("/getAllRequests")
	public ResponseEntity<List<AssetRequest>> getAllRequest() {
		return new ResponseEntity<List<AssetRequest>>(assetServices.getAllAssetRequests(), HttpStatus.OK);
	}

	@PostMapping("/acceptRequest/{requestId}")
	public ResponseEntity<AcceptAssetResponse> acceptAssetRequest(@PathVariable String requestId) {
		AcceptAssetResponse acceptAssetResponse = new AcceptAssetResponse();
		String status;
		if ((status = assetServices.acceptRequest(requestId)).equals("Success")) {
			acceptAssetResponse.setStatus(status);
			acceptAssetResponse.setRequests(assetServices.getAllAssetRequests());
			return new ResponseEntity<AcceptAssetResponse>(acceptAssetResponse,HttpStatus.OK);
		}
		acceptAssetResponse.setStatus(status);
		acceptAssetResponse.setRequests(assetServices.getAllAssetRequests());
		return new ResponseEntity<AcceptAssetResponse>(acceptAssetResponse,HttpStatus.OK);
	}
	
	@PostMapping("/rejectRequest/{requestId}")
	public ResponseEntity<AcceptAssetResponse> rejectAssetRequest(@PathVariable String requestId,@RequestBody String reason) {
		AcceptAssetResponse acceptAssetResponse = new AcceptAssetResponse();
		String status;
		if ((status = assetServices.rejectRequest(requestId,reason)).equals("Success")) {
			acceptAssetResponse.setStatus(status);
			acceptAssetResponse.setRequests(assetServices.getAllAssetRequests());
			return new ResponseEntity<AcceptAssetResponse>(acceptAssetResponse,HttpStatus.OK);
		}
		acceptAssetResponse.setStatus(status);
		acceptAssetResponse.setRequests(assetServices.getAllAssetRequests());
		return new ResponseEntity<AcceptAssetResponse>(acceptAssetResponse,HttpStatus.OK);
	}

	@GetMapping("/deleteAsset/{assetId}")
	public ResponseEntity<DeleteAssetResponse> removeAsset(@PathVariable String assetId) {
		String status;
		if (!(status = assetServices.deleteAsset(assetId)).equals("success"))
			return new ResponseEntity<DeleteAssetResponse>(DeleteAssetResponse.builder()
														.status(status)
														.build(), HttpStatus.NOT_ACCEPTABLE);
		return new ResponseEntity<DeleteAssetResponse>(DeleteAssetResponse.builder()
														.status(status)
														.assets(assetServices.getAllAssetsInfo())
														.build(), HttpStatus.OK);
	}

	@GetMapping("/isAdmin")
	public ResponseEntity<String> checkAdmin(HttpServletRequest request) {
		return new ResponseEntity<String>("ADMIN", HttpStatus.OK);	
	}

	@GetMapping("/dashboard")
	public ResponseEntity<AdminDashboard> getDashboard(){
		return ResponseEntity.ok(assetServices.getAdminDashboard());
	}
	
	@PostMapping("/downloadAssetExcel")
	public ResponseEntity<ExcelObj> downloadAssetExcel(@RequestBody AssetInfoJSON assetInfoJSON){
		System.out.println(".............");
		return ResponseEntity.ok(assetServices.downloadAssetExcel(assetInfoJSON));
	}
	
	@GetMapping("/downloadEmployeeExcel")
	public ResponseEntity<ExcelObj> downloadEmployeeExcel(){
		return ResponseEntity.ok(employeeServices.downloadEmployees());
	}
	
	@GetMapping("/getAllDeallocationRequests")
	public ResponseEntity<List<DeallocationRequestWithAttributes>> getAllDeallocationRequests(){
		return new ResponseEntity<List<DeallocationRequestWithAttributes>>(assetServices.getAllDeallocatoinRequestsInfo(),HttpStatus.OK);
	}
	
	@GetMapping("/deallocateAsset/{reqId}")
	public ResponseEntity<List<DeallocationRequestWithAttributes>> deallocateAsset(@PathVariable String reqId){
		if(!assetServices.deallocateAsset(reqId))
			return new ResponseEntity<List<DeallocationRequestWithAttributes>>(assetServices.getAllDeallocatoinRequestsInfo(),HttpStatus.NOT_ACCEPTABLE);
		return new ResponseEntity<List<DeallocationRequestWithAttributes>>(assetServices.getAllDeallocatoinRequestsInfo(),HttpStatus.OK);
	}
	
	@GetMapping("/cancelDeallocationRequest/{reqId}/{reason}")
	public ResponseEntity<List<DeallocationRequestWithAttributes>> cancelDeallocationRequest(@PathVariable("reqId") String reqId,@PathVariable("reason") String reason){
		
		
		if(!assetServices.deletedeallocationRequest(reqId, reason))
			return new ResponseEntity<List<DeallocationRequestWithAttributes>>(assetServices.getAllDeallocatoinRequestsInfo(),HttpStatus.NOT_ACCEPTABLE);
//		System.out.println("..........................");
		return new ResponseEntity<List<DeallocationRequestWithAttributes>>(assetServices.getAllDeallocatoinRequestsInfo(),HttpStatus.OK);
	}
	
}
