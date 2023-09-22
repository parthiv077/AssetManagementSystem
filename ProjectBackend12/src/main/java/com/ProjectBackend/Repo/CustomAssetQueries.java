package com.ProjectBackend.Repo;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import com.ProjectBackend.model.asset.AssetInfo;
import com.ProjectBackend.model.asset.AssetRequest;
import com.ProjectBackend.model.asset.UserAssetInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class CustomAssetQueries {
    private final MongoTemplate mongoTemplate;

    public CustomAssetQueries(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<AssetInfo> getAssetInfoByNameAndAttribuesHaving(String name,Map<String, Object>map) {
        Query query = new Query(Criteria.where("name").is(name));
        
        map.forEach((k, v) -> {
        	query.addCriteria(Criteria.where("attributes." + k).is(v));
        	
        });

        
        return mongoTemplate.find(query, AssetInfo.class);
    }
    
    public List<UserAssetInfo> getAssetInfoByNameAndEmployeeIdAndAttribuesHaving(String name,String employeeId,Map<String, Object>map) {
        Query query = new Query(Criteria.where("name").is(name).and("employeeId").is(employeeId));
        map.forEach((k, v) -> {
        	query.addCriteria(Criteria.where("attributes." + k).is(v));
        });
        return mongoTemplate.find(query, UserAssetInfo.class);
    }
    
    public List<AssetInfo> getFreeAssetInfoByNameAndAttribuesHaving(String name,Map<String, Object>map) {
        Query query = new Query(Criteria.where("name").is(name).and("allocatedTo").is(""));
        map.forEach((k, v) -> {
        	query.addCriteria(Criteria.where("attributes." + k).is(v));
        });
        return mongoTemplate.find(query, AssetInfo.class);
    }
    
    public List<AssetRequest> getRequestedAssetInfoByNameAndAttribuesHaving(String name,Map<String, Object>map) {
        Query query = new Query(Criteria.where("name").is(name));
        map.forEach((k, v) -> {
        	query.addCriteria(Criteria.where("attributes." + k).is(v));
        });
        return mongoTemplate.find(query, AssetRequest.class);
    }

	public List<UserAssetInfo> getUserAssetInfoByNameAndAttribuesHaving(String name, Map<String, Object> params) {
        List<AssetInfo> got = getAssetInfoByNameAndAttribuesHaving(name,params);
        
        List<UserAssetInfo> ret = new ArrayList<>();
        got.forEach((ai)->{
        	if(ai.getAllocatedTo().equals("")) {
	        	UserAssetInfo test = new UserAssetInfo();
	        	test.setName(ai.getName());
	        	test.setAttributes(ai.getAttributes());
	        	ret.add(test);
        	}
        });
        return ret;
	}
	
	public List<AssetInfo> getAllFreeAssets(){
		Query query = new Query(Criteria.where("allocatedTo").is(""));
        return mongoTemplate.find(query, AssetInfo.class);
	}
	
}