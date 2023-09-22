package com.ProjectBackend.config;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	private static final String SECRET_KEY = "576E5A7234753778214125442A472D4B6150645367556B58703273357638792F";

	public String extractEmployeeId(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public String generateToken(UserDetails userDetails) {
		return  generateToken(new HashMap<>(), userDetails);
	}
	
	public String generateToken(Map<String, Object> extraClaims,UserDetails userDetails) {
		return Jwts
				.builder()
				.setClaims(extraClaims)
				.setSubject(userDetails.getUsername())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 2 ))			//JWT token expiration time is 2 hrs.
				.signWith(getSignInKey(), SignatureAlgorithm.HS256)
				.compact();
	}
	
	public <T> T extractClaim(String token,Function<Claims, T> claimsResolver) {
		final Claims claims = extractAlClaims(token);
		return claimsResolver.apply(claims);
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String employeeId = extractEmployeeId(token);
		return (employeeId.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}
	
	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	private Claims extractAlClaims(String token) {
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
	}

	private Key getSignInKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	
}
