package com.ProjectBackend.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.ProjectBackend.model.employee.Employee;

@Component
@Repository
public interface EmployeeRepo extends MongoRepository<Employee, String>
{
	public Employee findByEmployeeId(String employoeeId);
}
