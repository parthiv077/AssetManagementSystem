package com.ProjectBackend.model.asset;

import java.util.Date;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.stereotype.Component;

import lombok.Data;

@Document
@Component
@Data
public class AssetRequest {

	@MongoId
	private String requestId;
	private String name;
	private String employeeId;							//employee id will be maintained in session				
	private int noOfRequest = 1;
	private Date dateOfRequest;							//dateOfRequest will not be send in JSON it will be maintained in BACKEND
	private Map<String, Object> attributes;

}
