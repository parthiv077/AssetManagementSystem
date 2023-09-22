package com.ProjectBackend.Controller;

import com.ProjectBackend.Repo.LoginRepo;
import com.ProjectBackend.model.FirstLoginRequest;
import com.ProjectBackend.model.LoginColl;
import com.ProjectBackend.model.LoginRequest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RequestMapping("/login")
@RestController
public class LoginController {

	@Autowired
	LoginRepo repo;

	@GetMapping("")
	public ResponseEntity<String> testConnection() {
		System.out.println("hello.");
		
		return new ResponseEntity<String>("Hello", HttpStatus.OK);
	}
	
	@GetMapping("/logout")
	public ResponseEntity<HttpStatus> logout(HttpServletRequest request){
		return new ResponseEntity<HttpStatus>(HttpStatus.OK);
	}
}
