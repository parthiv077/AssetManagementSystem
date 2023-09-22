package com.ProjectBackend.Repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;

import com.ProjectBackend.model.asset.AssetRequest;

@Component
public interface AssetRequestRepo extends MongoRepository<AssetRequest, String>
{
	public List<AssetRequest> findByEmployeeId(String employeeId);
}
