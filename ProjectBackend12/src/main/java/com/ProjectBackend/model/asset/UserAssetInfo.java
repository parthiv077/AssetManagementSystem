package com.ProjectBackend.model.asset;

import java.util.Map;

public class UserAssetInfo {

	private String name;
	private String assetId;
	public String getAid() {
		return assetId;
	}

	public void setAid(String aid) {
		this.assetId = aid;
	}

	private Map<String, Object> attributes;

	public Map<String, Object> getAttributes() {
		return attributes;
	}

	public void setAttributes(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
