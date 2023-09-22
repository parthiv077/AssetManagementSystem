package com.ProjectBackend.model.asset;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AcceptAssetResponse {
	private String status;
	private List<AssetRequest> requests;
}
