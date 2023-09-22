package com.ProjectBackend.model.asset;

import java.util.Date;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.MongoId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeallocationRequestWithAttributes {

	@MongoId
	private String drId;
	private String assetId;
	private String className;
	private String employeeId;
	private Map<String, Object> attributes;
	private byte[] png;
	private Date dateOfRequest;
}
