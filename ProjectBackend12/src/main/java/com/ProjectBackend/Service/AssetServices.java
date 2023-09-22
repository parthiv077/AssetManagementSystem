package com.ProjectBackend.Service;

import java.util.List;

import org.apache.poi.ss.usermodel.Workbook;

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
import com.ProjectBackend.model.employee.UserDashboard;

public interface AssetServices {

	public Boolean insertNewAsset(AssetInfoJSON asset);

	public List<AssetInfo> getAllAssetsInfo();

	public Boolean insertNewAssetClass(AddAssetClassInfo asset);

	public AssetClass getAssetClass(String name);

	public List<AssetClass> getAllAssetClasses();

	public String addAssetRequest(AssetRequest request);

	public List<AssetRequest> getAllAssetRequests();

	public String acceptRequest(String id);

	public List<UserAssetInfo> getAllAssetInfoForParticularUser(String employeeId);

	public List<AssetRequest> getAllRequestedAssetInfoForParticularUser(String employeeId);

	public List<AssetInfo> getAssetInfoByNameAndAttribuesHaving(AssetInfoJSON filter);

	public List<UserAssetInfo> getFilteredAssetInfoForParticularUser(String empId, AssetInfoJSON filterInfo);

	public String deleteAsset(String aid);

	public List<UserAssetInfo> getFilteredAssetInfo(AssetInfoJSON filterInfo);

	public Workbook createExcelAccordingToClass(String categoryName);

	public String rejectRequest(String requestId, String reason);

	public AdminDashboard getAdminDashboard();

	public UserDashboard getUserDashboard(String empId);

	public boolean insertNewAssetExcel(ExcelObj assetExcel);

	public ExcelObj downloadAssetExcel(AssetInfoJSON assetInfoJSON);

	public String addDeallocationRequest(AssetDeallocationRequest assetDeallocationRequest);

	public List<DeallocationRequest> getAllDeallocatoinRequestsInfoForParticularUser(String empId);

	public List<DeallocationRequestWithAttributes> getAllDeallocatoinRequestsInfo();

	public boolean deallocateAsset(String reqId);

	public boolean deletedeallocationRequest(String reqId, String reason);

}
