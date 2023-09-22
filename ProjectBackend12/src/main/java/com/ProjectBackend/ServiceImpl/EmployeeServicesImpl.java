package com.ProjectBackend.ServiceImpl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.ProjectBackend.Repo.EmployeeRepo;
import com.ProjectBackend.Repo.LoginRepo;
import com.ProjectBackend.Service.EmployeeServices;
import com.ProjectBackend.auth.RegisterRequest;
import com.ProjectBackend.config.JwtService;
import com.ProjectBackend.model.LoginColl;
import com.ProjectBackend.model.asset.AssetInfo;
import com.ProjectBackend.model.asset.ExcelObj;
import com.ProjectBackend.model.employee.Employee;

import lombok.AllArgsConstructor;
import lombok.Data;

@Service
@AllArgsConstructor
public class EmployeeServicesImpl implements EmployeeServices
{
	private final EmployeeRepo empRepo;

	private final LoginColl lc;
	
	private final LoginRepo loginRepo;
	
	@Override
	public Employee getEmployee(String empId) {
		return empRepo.findByEmployeeId(empId);
	}

	@Override
	public List<Employee> getAllEmployees() {
		return empRepo.findAll();
	}

	private final JavaMailSender mailSender;

	private String generateToken() {
		StringBuilder token = new StringBuilder();
		return token.append(UUID.randomUUID().toString()).append(UUID.randomUUID().toString()).toString();
	}

	private void sendEmail(Employee emp,String token) {
		String body = "http://localhost:3000/userlogin/" + token; 						// have to provide the first time password page link
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(emp.getEmail());
		message.setSubject("Login for First time into AMS.");
		message.setText(body);
		mailSender.send(message);
	}

	@Override
	public Employee addNewEmployee(RegisterRequest request) { // It will store the emp details in employee collection as well
														// as into the loginColl and send the mail to the employee that
														// he has been added into the server and has to perform first
														// time login
		if(empRepo.findByEmployeeId(request.getEmployeeId())!=null) {
			return null;
		}
		var emp = Employee.builder()
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
				.password(null)
				.build();
		
		empRepo.save(emp);
		
		lc.setEmployeeId(request.getEmployeeId());
		String token = generateToken();
		lc.setToken(token);
		loginRepo.save(lc);
		
		sendEmail(emp,token);
		return emp;
	}

	@Override
	public ExcelObj downloadEmployees() {
		List<Employee> employees = empRepo.findAll();
		Workbook workbook = new XSSFWorkbook();
		Sheet sheet = workbook.createSheet("Sheet1");
		int rowNo = 0;
		Row headerRow = sheet.createRow(rowNo++);
		int  colNo=0;
		headerRow.createCell(colNo++).setCellValue("Employee Id");
		headerRow.createCell(colNo++).setCellValue("First Name");
		headerRow.createCell(colNo++).setCellValue("Middle Name");
		headerRow.createCell(colNo++).setCellValue("Last Name");
		headerRow.createCell(colNo++).setCellValue("Department");
		headerRow.createCell(colNo++).setCellValue("Role");
		headerRow.createCell(colNo++).setCellValue("Contact No");
		headerRow.createCell(colNo++).setCellValue("Email");
		headerRow.createCell(colNo++).setCellValue("Birth Date");
		headerRow.createCell(colNo++).setCellValue("Joining Date");
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
		
		for(Employee employee : employees) {
			colNo = 0; 
			Row row = sheet.createRow(rowNo++);
			row.createCell(colNo++).setCellValue(employee.getEmployeeId());
			row.createCell(colNo++).setCellValue(employee.getEmployeeFirstName());
			row.createCell(colNo++).setCellValue(employee.getEmployeeMiddleName());
			row.createCell(colNo++).setCellValue(employee.getEmployeeLastName());
			row.createCell(colNo++).setCellValue(employee.getDepartment());
			row.createCell(colNo++).setCellValue(employee.getRole());
			row.createCell(colNo++).setCellValue(employee.getContactNo());
			row.createCell(colNo++).setCellValue(employee.getEmail());
			row.createCell(colNo++).setCellValue(employee.getDateOfBirth().toString());
			row.createCell(colNo++).setCellValue(employee.getDateOfJoining().toString());
		}
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			workbook.write(bos);
		}catch(Exception e) {}
		byte[] returnValue = bos.toByteArray();
		return ExcelObj.builder()
				.name("Employee Details")
				.excelBytes(returnValue)
				.build();
	}
}
