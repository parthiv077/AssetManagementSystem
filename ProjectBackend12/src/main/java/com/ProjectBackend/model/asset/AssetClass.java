package com.ProjectBackend.model.asset;

import java.util.List;
//import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "assetClass")
public class AssetClass {

	@MongoId
	private String classId;
	private String name;
	private List<String> keys; // String , integer , float , date , point , Object , Image(Binary) 

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getKeys() {
		return keys;
	}

	public void setKeys(List<String> keys) {
		this.keys = keys;
	}

	public String getClassId() {
		return classId;
	}

	public void setClassId(String classId) {
		this.classId = classId;
	}

}
