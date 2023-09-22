package com.ProjectBackend.Service;

import java.util.List;

import com.ProjectBackend.auth.RegisterRequest;
import com.ProjectBackend.model.asset.ExcelObj;
import com.ProjectBackend.model.employee.Employee;

public interface EmployeeServices {

	public Employee addNewEmployee(RegisterRequest employee);

	public Employee getEmployee(String empId);

	public List<Employee> getAllEmployees();

	public ExcelObj downloadEmployees();
}
