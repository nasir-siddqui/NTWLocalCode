USE AdvanceWebb

INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 5
FROM
	CompanyInfo
WHERE
	ActiveStat = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 6
FROM
	CompanyInfo
WHERE
	[ActiveVIP] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 7
FROM
	CompanyInfo
WHERE
	[ActiveVIP] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 8
FROM
	CompanyInfo
WHERE
	[ExtendedMulti] = 1
	
INSERT INTO CompanyInfosInRoles (CompanyInfoId, RoleId)
SELECT
	CompanyId, 9
FROM
	CompanyInfo
WHERE
	[ActiveCpa] = 1