package com.ProjectBackend.model.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboard {
	private int aquiredAssets;
	private int requestedAssets;
	private int deallocationRequests;
}
