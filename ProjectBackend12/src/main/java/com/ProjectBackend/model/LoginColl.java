package com.ProjectBackend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginColl {

	@MongoId
	private String lcId;
	private String employeeId;
	private String token;

}
