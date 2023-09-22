package com.ProjectBackend.Repo;

import com.ProjectBackend.model.LoginColl;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

@Component
@Repository
public interface LoginRepo extends MongoRepository<LoginColl , Integer>
{
	
//	@Query("* from login where name=?1 and passsword=?2")
//	LoginColl check(String name,String password);
	
	LoginColl findByToken(String token);
}
