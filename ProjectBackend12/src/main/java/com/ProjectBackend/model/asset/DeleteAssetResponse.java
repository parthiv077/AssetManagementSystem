package com.ProjectBackend.model.asset;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteAssetResponse {
	private String status;
	private List<AssetInfo> assets;
}
