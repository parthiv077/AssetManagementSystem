package com.ProjectBackend.model.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboard {
	private int totalAssets;
	private int totalEmployees;
	private int noOfRequests;
	private int acquiredAssets;
	private int availableAssets;

}
