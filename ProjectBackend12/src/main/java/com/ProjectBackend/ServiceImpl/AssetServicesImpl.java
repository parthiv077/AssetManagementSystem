package com.ProjectBackend.ServiceImpl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ProjectBackend.Repo.AssetClassRepo;
import com.ProjectBackend.Repo.AssetRepo;
import com.ProjectBackend.Repo.AssetRequestRepo;
import com.ProjectBackend.Repo.CustomAssetQueries;
import com.ProjectBackend.Repo.DeallocationRequestRepo;
import com.ProjectBackend.Repo.EmployeeRepo;
import com.ProjectBackend.Service.AssetServices;
import com.ProjectBackend.model.asset.AddAssetClassInfo;
import com.ProjectBackend.model.asset.AssetInfoJSON;
import com.ProjectBackend.model.asset.AssetClass;
import com.ProjectBackend.model.asset.AssetDeallocationRequest;
import com.ProjectBackend.model.asset.ExcelObj;
import com.ProjectBackend.model.asset.AssetInfo;
import com.ProjectBackend.model.asset.AssetRequest;
import com.ProjectBackend.model.asset.DeallocationRequest;
import com.ProjectBackend.model.asset.DeallocationRequestWithAttributes;
import com.ProjectBackend.model.asset.UserAssetInfo;
import com.ProjectBackend.model.employee.AdminDashboard;
import com.ProjectBackend.model.employee.Employee;
import com.ProjectBackend.model.employee.UserDashboard;

import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AssetServicesImpl implements AssetServices {

	@Autowired
	AssetRepo assetRepo;

	@Autowired
	AssetClassRepo classRepo;

	@Autowired
	AssetRequestRepo reqRepo;

	@Autowired
	AssetInfo assetInfo;

	@Autowired
	EmployeeRepo empRepo;
	
	@Autowired
	DeallocationRequestRepo deallocationRequestRepo;

	@Autowired
	CustomAssetQueries queries;

	@Override
	public Boolean insertNewAsset(AssetInfoJSON asset) {
		AssetInfo ai = new AssetInfo();
		String classId = classRepo.findByName(asset.getName()).getClassId();
		if (classId == null)
			return false;

		ai.setName(asset.getName());
		ai.setClassId(classId);
		ai.setAttributes(asset.getParams());
//		System.out.println(asset.getParams());
//		Map<String,Object> store = new HashMap<>();
//		Map<String,String> got = classRepo.findByName(asset.getName()).getKeys();
//		
//		Map<String,Object> rightnow = asset.getParams();
//		
//		
//		rightnow.forEach((k,v)->{
//			switch(got.get(k)) {
//				case "String":	store.put(k,(String)v);
//				break;
//				case "Integer":	store.put(k,Integer.parseInt((String)v));
//				break;
//				case "Float":	store.put(k,Float.parseFloat((String)v));
//				break;
//				default: store.put(k, v);
//			}
//		});
//		ai.setAttributes(store);
		assetRepo.save(ai);
		return true;
	}

	@Override
	public Boolean insertNewAssetClass(AddAssetClassInfo asset) {
		if (classRepo.findByName(asset.getName()) != null)
			return false;
		AssetClass as = new AssetClass();
		as.setName(asset.getName());
		as.setKeys(asset.getKeys());
		classRepo.save(as);
		return true;
	}

	@Override
	public AssetClass getAssetClass(String name) {
		return classRepo.findByName(name);
	}

	@Override
	public List<AssetClass> getAllAssetClasses() {
		return classRepo.findAll();
	}

	@Override
	public List<AssetInfo> getAllAssetsInfo() {
		List<AssetInfo> ret = assetRepo.findAll();
		
		ret.forEach(x -> {
			String id = x.getAllocatedTo();
			if(!id.equals("")) {
				Employee info = empRepo.findByEmployeeId(id);
				x.setAllocatedTo(info.getEmployeeFirstName()+" "+info.getEmployeeLastName());
			}
		});
//		}catch(Exception e) {}
		return ret;
	}

	@Override
	public String addAssetRequest(AssetRequest request) {
		AssetClass clas;
		if ((clas = classRepo.findByName(request.getName())) == null)
			return "Class with name " + request.getName() + " doesn't exist";
		for (String i : request.getAttributes().keySet()) {
			if (!clas.getKeys().contains(i)) { // if any such field is to be applied on the class that the class does
												// not contain than not allow the request
				return "There is no field named " + i;
			}
		}

		List<AssetInfo> availabelAssets = queries.getFreeAssetInfoByNameAndAttribuesHaving(request.getName(),
				request.getAttributes());
		List<AssetRequest> requestedAssets = queries.getRequestedAssetInfoByNameAndAttribuesHaving(request.getName(),
				request.getAttributes());

		if (availabelAssets.size() - requestedAssets.size() < request.getNoOfRequest())
			return "Asset Not Available";

		request.setDateOfRequest(new Date());
		reqRepo.save(request);
		return "Success";
	}

	@Override
	public List<AssetRequest> getAllAssetRequests() {
		List<AssetRequest> ret = reqRepo.findAll();
		
		ret.forEach(r -> {
			Employee temp = empRepo.findByEmployeeId(r.getEmployeeId());
			r.setEmployeeId(temp.getEmployeeFirstName()+" "+temp.getEmployeeLastName());
		});
		
		return ret;
	}

	@Autowired
	private JavaMailSender mailSender;

	private void sendAcceptanceEmail(AssetRequest request) { // have to provide the first time password page link
		String to = empRepo.findByEmployeeId(request.getEmployeeId()).getEmail();
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Acceptance of your Asset Request.");

		String text = "Your Request for Asset with the info below is accepted.\n" + "Asset Name : " + request.getName()
				+ "\nNo. of Asset Requested" + request.getNoOfRequest() + "\nAttributes : " + request.getAttributes()
				+ "\nRequested On : " + request.getDateOfRequest();

		message.setText(text);
		mailSender.send(message);
	}

	private void sendAssetRejectanceEmail(AssetRequest request,String reason) { // have to provide the first time password page link
		String to = empRepo.findByEmployeeId(request.getEmployeeId()).getEmail();
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Rejection of your Asset Request.");

		String text = "Your Request for Asset with the info below is rejected by the admin.\n" + "Asset Name : " + request.getName()
				+ "\nNo. of Asset Requested" + request.getNoOfRequest() + "\nAttributes : " + request.getAttributes()
				+ "\nRequested On : " + request.getDateOfRequest()
				+ "\nReason : " + reason;

		message.setText(text);
		mailSender.send(message);
	}
	
	@Override
	public String acceptRequest(String id) {
		AssetRequest requestedAsset = reqRepo.findById(id).orElse(null);
		if (requestedAsset == null)
			return "No request for this is present in database";
		log.info("request is present in the database");
		
		
		List<AssetInfo> availabelAssets = queries.getFreeAssetInfoByNameAndAttribuesHaving(requestedAsset.getName(),requestedAsset.getAttributes());
		for (int i = 0; i < requestedAsset.getNoOfRequest(); i++) {
			availabelAssets.get(i).setAllocatedTo(requestedAsset.getEmployeeId());
		}
		assetRepo.saveAll(availabelAssets);

		sendAcceptanceEmail(requestedAsset);

		reqRepo.delete(requestedAsset);
		return "Success";
	}

	@Override
	public List<UserAssetInfo> getAllAssetInfoForParticularUser(String employeeId) {
		List<UserAssetInfo> assets = assetRepo.findByAllocatedTo(employeeId);
		assets.forEach((k)->{
			k.toString();
		});
		return assets;
	}

	@Override
	public List<AssetRequest> getAllRequestedAssetInfoForParticularUser(String employeeId) {
		List<AssetRequest> assets = reqRepo.findByEmployeeId(employeeId);
		return assets;
	}

	@Override
	public List<AssetInfo> getAssetInfoByNameAndAttribuesHaving(AssetInfoJSON filterInfo) {
		return queries.getAssetInfoByNameAndAttribuesHaving(filterInfo.getName(), filterInfo.getParams());
	}

	@Override
	public List<UserAssetInfo> getFilteredAssetInfoForParticularUser(String empId, AssetInfoJSON filterInfo) {
		return queries.getAssetInfoByNameAndEmployeeIdAndAttribuesHaving(filterInfo.getName(),empId, filterInfo.getParams());
	}

	@Override
	public String deleteAsset(String aid) {
		
		AssetInfo instance = assetRepo.findByAssetId(aid);
		if(instance == null )
			return "No asset with Id " + aid + " found.";
		else if(!instance.getAllocatedTo().equals(""))
			return "This asset is allocated";
		assetRepo.delete(instance);
		return "success";
	}

	@Override
	public Workbook createExcelAccordingToClass(String categoryName) {
		Workbook workbook = new XSSFWorkbook();
		
		Sheet sheet = workbook.createSheet("Sheet1");
		
		Row headerRow = sheet.createRow(0);
		
		int i=0;
		AssetClass classInfo = classRepo.findByName(categoryName);
		
//		headerRow.createCell(i++).setCellValue("Category Name");
		for(String s : classInfo.getKeys()) {
			headerRow.createCell(i++).setCellValue(s);
		}
		
		return workbook;
	}

	public List<UserAssetInfo> getFilteredAssetInfo(AssetInfoJSON filterInfo) {
		return queries.getUserAssetInfoByNameAndAttribuesHaving(filterInfo.getName(), filterInfo.getParams());
	}

	@Override
	public String rejectRequest(String requestId,String reason) {
		AssetRequest requestedAsset = reqRepo.findById(requestId).orElse(null);
		if (requestedAsset == null)
			return "No request for this is present in database";
		log.info("request is present in the database");
		
		sendAssetRejectanceEmail(requestedAsset,reason);

		reqRepo.delete(requestedAsset);
		return "Success";
	}

	@Override
	public AdminDashboard getAdminDashboard() {
		AdminDashboard adminDashboard = AdminDashboard.builder()
				.noOfRequests(reqRepo.findAll().size())
				.totalAssets(assetRepo.findAll().size())
				.totalEmployees(empRepo.findAll().size())
				.availableAssets(queries.getAllFreeAssets().size())
				.build();
		adminDashboard.setAcquiredAssets(adminDashboard.getTotalAssets()-adminDashboard.getAvailableAssets());
		return adminDashboard;
	}

	@Override
	public UserDashboard getUserDashboard(String empId) {
		UserDashboard userDashboard = UserDashboard.builder()
				.aquiredAssets(assetRepo.findByAllocatedTo(empId).size())
				.requestedAssets(reqRepo.findByEmployeeId(empId).size())
				.deallocationRequests(deallocationRequestRepo.findByEmployeeId(empId).size())
				.build();
		return userDashboard;
	}

	@Override
	public boolean insertNewAssetExcel(ExcelObj assetExcel) {
		ByteArrayInputStream inputStream = new ByteArrayInputStream(assetExcel.getExcelBytes());
		try {
			Workbook workbook = new XSSFWorkbook(inputStream);
			Sheet sheet = workbook.getSheetAt(0);
			List<AssetInfoJSON> assets = new ArrayList<>();
			AssetClass assetClass = classRepo.findByName(assetExcel.getName());
			int noOfKeys = assetClass.getKeys().size();
			for (Row row : sheet) {
				if(row.getRowNum()==0) {
					int i = 0;
					for (Cell cell : row) {
				        String value = cell.getStringCellValue();
				        if(i == noOfKeys || !value.toLowerCase().equals(assetClass.getKeys().get(i).toString().toLowerCase())) {
				        	return false;
				        }
				        i=i+1;
				    }
					if(i != noOfKeys) {
						return false;
					}
				}else {
					
					int i = 0;
					
					Map<String, Object> t = new HashMap<>();
					for (Cell cell : row) {
						if(i == noOfKeys) {
				    		return false;
				    	}
				    	String key = assetClass.getKeys().get(i);
				    	Object value;				
				    	if(cell.getCellType().toString().equals("NUMERIC")) {
				    		value = cell.getNumericCellValue();
				    	}
				    	else {
				    		value = cell.getStringCellValue();
				    	}
				    	if(assetClass.getKeys().get(i).toLowerCase().contains("date")) {
				    		Date javaDate = DateUtil.getJavaDate((Double)value);
				    		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
				    		value= formatter.format(javaDate);
				    	}
				    	else if(cell.getCellType().toString().equals("NUMERIC")) {
				    		int x = ((Double)value).intValue();
				    		value = x;
				    	}
				    	value = value.toString();
				        
				        if(value == null) {
				        	return false;
				        }
				    	t.put(key, value);
				    	i = i+1;
				    }
					AssetInfoJSON temp = AssetInfoJSON.builder()
			        		.name(assetExcel.getName())
			        		.params(t)
			        		.build();
				    assets.add(temp);
				}
			}
			
			assets.forEach((asset) -> {
				insertNewAsset(asset);
			});
			workbook.close();
		}catch(Exception e) {
			System.out.println(e.toString());
		}
		return true;
	}

	@Override
	public ExcelObj downloadAssetExcel(AssetInfoJSON assetInfoJSON) {
		List<AssetInfo> assets = queries.getAssetInfoByNameAndAttribuesHaving(assetInfoJSON.getName(), assetInfoJSON.getParams());
		Workbook workbook = new XSSFWorkbook();
		Sheet sheet = workbook.createSheet("Sheet1");
		int rowNo = 0;
		Row headerRow = sheet.createRow(rowNo++);
		int  colNo=0;
		headerRow.createCell(colNo++).setCellValue("AssetId");
		headerRow.createCell(colNo++).setCellValue("ClassId");
		headerRow.createCell(colNo++).setCellValue("ClassName");
		headerRow.createCell(colNo++).setCellValue("AllocatedTo");
		for(String s : assets.get(0).getAttributes().keySet()) {
			headerRow.createCell(colNo++).setCellValue(s);
		}
		for(AssetInfo asset : assets) {
			colNo = 0; 
			Row row = sheet.createRow(rowNo++);
			row.createCell(colNo++).setCellValue(asset.getAssetId());
			row.createCell(colNo++).setCellValue(asset.getClassId());
			row.createCell(colNo++).setCellValue(asset.getName());
			row.createCell(colNo++).setCellValue(asset.getAllocatedTo());
			for(Object s : asset.getAttributes().values()) {
				row.createCell(colNo++).setCellValue(s.toString());
			}
		}
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			workbook.write(bos);
		}catch(Exception e) {}
		byte[] returnValue = bos.toByteArray();
		return ExcelObj.builder()
				.name(assetInfoJSON.getName())
				.excelBytes(returnValue)
				.build();
	}

	@Override
	public String addDeallocationRequest(AssetDeallocationRequest assetDeallocationRequest) {
		
		AssetInfo assetInfo = assetRepo.findByAssetId(assetDeallocationRequest.getAssetId());
		if(assetInfo.getAllocatedTo().equals("")) {
			return "Asset is not allocated.";
		}
		else if(!assetInfo.getAllocatedTo().equals(assetDeallocationRequest.getEmployeeId())) {
			return  "Asset is  not allocated to you.";
		}
		DeallocationRequest temp = DeallocationRequest.builder()
										.assetId(assetDeallocationRequest.getAssetId())
										.className(assetInfo.getName())
										.dateOfRequest(new Date())
										.employeeId(assetDeallocationRequest.getEmployeeId())
										.png(assetDeallocationRequest.getPng())
										.build();
		deallocationRequestRepo.save(temp);
		return "Success";
	}
	
	@Override
	public List<DeallocationRequestWithAttributes> getAllDeallocatoinRequestsInfo() {
		List<DeallocationRequest> requests =  deallocationRequestRepo.findAll();
		
		List<DeallocationRequestWithAttributes> ret = new ArrayList<>();
		
		for(DeallocationRequest temp : requests) {
			Employee e = empRepo.findByEmployeeId(temp.getEmployeeId());
			DeallocationRequestWithAttributes t = DeallocationRequestWithAttributes.builder()
													.assetId(temp.getAssetId())
													.className(temp.getClassName())
													.dateOfRequest(temp.getDateOfRequest())
													.employeeId(e.getEmployeeFirstName()+" "+e.getEmployeeLastName())
													.png(temp.getPng())
													.drId(temp.getDrId())
													.attributes(assetRepo.findByAssetId(temp.getAssetId()).getAttributes())
													.build();
			ret.add(t);
		}
		
		return ret;
	}

	@Override
	public List<DeallocationRequest> getAllDeallocatoinRequestsInfoForParticularUser(String empId) {
		return deallocationRequestRepo.findByEmployeeId(empId);
	}

	@Override
	public boolean deallocateAsset(String reqId) {
		DeallocationRequest deallocationRequest;
		if((deallocationRequest = deallocationRequestRepo.findById(reqId).orElse(null)) == null)
			return false;
		AssetInfo assetInfo = assetRepo.findByAssetId(deallocationRequest.getAssetId());
		assetInfo.setAllocatedTo("");
		assetRepo.save(assetInfo);
		sendDeallocationAcceptanceEmail(deallocationRequest);
		deallocationRequestRepo.delete(deallocationRequest);
		return true;
	}

	private void sendDeallocationAcceptanceEmail(DeallocationRequest request) { // have to provide the first time password page link
		String to = empRepo.findByEmployeeId(request.getEmployeeId()).getEmail();
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Acceptance of your Asset Request.");

		String text = "Your Request for Deallocation Asset with the info below is accepted.\n" + "Asset Name : " + request.getClassName()
				+ "\nRequested On : " + request.getDateOfRequest();

		message.setText(text);
		mailSender.send(message);
	}
	
	private void sendDeallocationRejectanceEmail(DeallocationRequest deallocationRequest,String reason) { // have to provide the first time password page link
		String to = empRepo.findByEmployeeId(deallocationRequest.getEmployeeId()).getEmail();
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Rejection of your Deallocation Asset Request.");

		String text = "Your Request for Deallocation of Asset with the info below is rejected by the admin.\n" + "Asset Name : " + deallocationRequest.getClassName()
				+ "\nRequested On : " + deallocationRequest.getDateOfRequest()
				+ "\nReason : " + reason;

		message.setText(text);
		mailSender.send(message);
	}
	
	@Override
	public boolean deletedeallocationRequest(String reqId, String reason) {
		DeallocationRequest deallocationRequest;
		if((deallocationRequest = deallocationRequestRepo.findById(reqId).orElse(null)) == null)
			return false;
		
		sendDeallocationRejectanceEmail(deallocationRequest, reason);
		
		deallocationRequestRepo.delete(deallocationRequest);
		return true;
	}

}