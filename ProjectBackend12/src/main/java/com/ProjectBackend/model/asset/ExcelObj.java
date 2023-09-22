package com.ProjectBackend.model.asset;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExcelObj {
	private String name; // asset class name
	private byte[] excelBytes;

}
