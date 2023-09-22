package com.ProjectBackend.Repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ProjectBackend.model.asset.DeallocationRequest;

public interface DeallocationRequestRepo extends MongoRepository<DeallocationRequest, String> {

	List<DeallocationRequest> findByEmployeeId(String employeeId);
}
