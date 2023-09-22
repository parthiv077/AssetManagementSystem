package com.ProjectBackend.auth;

import java.util.Date;

import javax.annotation.RegEx;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	@NotNull
	private String employeeId;
	@Size(min = 4, max = 12)
	private String password;
	@Size(min = 2, max = 15)
	private String employeeFirstName;
	@Size(min = 2, max = 15)
	private String employeeMiddleName;
	@Size(min = 2, max = 15)
	private String employeeLastName;
	@Size(min = 2, max = 4)
	private String department;
	@NotNull
	@Pattern(regexp = "^[a-zA-Z]+$")
	private String role;
	@NotNull
	@Pattern(regexp = "^(\\+91[\\-\\s]?)?[0]?(91)?[6789]\\d{9}$\r\n")
	private String contactNo;
	@NotNull
	@Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$\r\n")
	private String email;
	private Date dateOfBirth;
	private Date dateOfJoining;
	
}
