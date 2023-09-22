package com.ProjectBackend.model.asset;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Document
@AllArgsConstructor
@NoArgsConstructor
public class DeallocationRequest {
	@MongoId
	private String drId;
	private String assetId;
	private String className;
	private String employeeId;
	private byte[] png;
	private Date dateOfRequest;
}
