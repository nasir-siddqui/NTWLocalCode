USE AdvanceWebb

INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT CompanyInfo.CompanyId, 3
FROM CompanyInfo
WHERE CompanyInfo.OrgNr = '999999-9999'