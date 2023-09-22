package com.ProjectBackend.Repo;

//import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.ProjectBackend.model.asset.AssetClass;

@Component
@Repository
public interface AssetClassRepo extends MongoRepository<AssetClass, Integer>
{
	AssetClass findByName(String name);
}
