package com.ProjectBackend.auth;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ProjectBackend.Repo.EmployeeRepo;
import com.ProjectBackend.Repo.LoginRepo;
import com.ProjectBackend.config.JwtService;
import com.ProjectBackend.model.FirstLoginRequest;
import com.ProjectBackend.model.LoginColl;
import com.ProjectBackend.model.employee.Employee;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

	private final EmployeeRepo employeeRepo;
	private final LoginRepo loginRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	
	public AuthenticationResponse register(RegisterRequest request) {
		var user = Employee.builder()
				.employeeFirstName(request.getEmployeeFirstName())
				.employeeLastName(request.getEmployeeLastName())
				.employeeId(request.getEmployeeId())
				.contactNo(request.getContactNo())
				.dateOfBirth(request.getDateOfBirth())
				.dateOfJoining(request.getDateOfJoining())
				.department(request.getDepartment())
				.email(request.getEmail())
				.employeeMiddleName(request.getEmployeeMiddleName())
				.role(request.getRole())
				.appRole("USER")
				.password(passwordEncoder.encode(request.getPassword()))
				.build();
		
		employeeRepo.save(user);
		
		var jwtToken  = jwtService.generateToken(user);
			
		return AuthenticationResponse.builder()
				.employeeId(user.getEmployeeId())
				.token(jwtToken)
				.role(user.getAppRole())
				.build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmployeeId(), 
						request.getPassword()
				)
		);
		var user = employeeRepo.findByEmployeeId(request.getEmployeeId());
		var jwtToken  = jwtService.generateToken(user);
		return AuthenticationResponse.builder()
				.employeeId(user.getEmployeeId())
				.token(jwtToken)
				.role(user.getAppRole())
				.build();
	}

	public AuthenticationResponse setpassword(FirstLoginRequest req) {
		LoginColl lc = loginRepo.findByToken(req.getToken());
		if (lc != null) {
			var user = employeeRepo.findByEmployeeId(lc.getEmployeeId());
			user.setPassword(passwordEncoder.encode(req.getPassword()));
			loginRepo.delete(lc);
			employeeRepo.save(user);
			var jwtToken  = jwtService.generateToken(user);
			return AuthenticationResponse.builder()
				.employeeId(user.getEmployeeId())
				.token(jwtToken)
				.role(user.getAppRole())
				.build();	
		}
		return AuthenticationResponse.builder().build();
	}
	
}
