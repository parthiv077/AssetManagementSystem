package com.ProjectBackend.Repo;

import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.ProjectBackend.model.asset.AssetInfo;
import com.ProjectBackend.model.asset.UserAssetInfo;

@Component
@Repository
public interface AssetRepo extends MongoRepository<AssetInfo, Integer> {
//	@Query(value = "{ 'name' : ?0, 'attributes.name' : ?1 }")
//    List<AssetInfo> findByNameIdAndAttributesName(String name, String assetName);

	AssetInfo findByAssetId(String assetId);
	
	@Query(value = "{ 'allocatedTo' : ?0 }", fields = "{ 'name' : 1 , attributes : 1 } ")
	List<UserAssetInfo> findByAllocatedTo(String allocatedTo);

	@Query(value = "{'name' : ?0, 'attributes.price' : { $gte : ?1}}")
	List<UserAssetInfo> hello(String name, String price);
	
//	@Query("{'name' : ?0, 'attributes' : ?1 }")
//	AssetInfo findByNameAndAttributes(String name,Map<String, Object> map);
	
//	AssetInfo findByNameAndAttributes(String name, Map<String, Object> attributes);
//	StringBuilder sb = new StringBuilder("{'name' : $regex : {?0}, ");
	
//	{'name' : {$regex : 'lap'}}
	
	@Query(value = "{'name' : {$regex : ?0, $options : 'i'}}")
	List<AssetInfo> filterXYZ(String name);
	

}