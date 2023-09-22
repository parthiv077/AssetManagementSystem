package com.ProjectBackend.model.asset;

import java.util.Date;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssetDeallocationRequest {
	private String assetId;
	private String employeeId;
	private byte[] png;
	
}
