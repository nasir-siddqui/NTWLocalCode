USE AdvanceWebb

UPDATE
	CompanyInfo
SET
	UserIdA = NULL
WHERE
	UserIdA NOT IN (SELECT UserID FROM [Users])
	
UPDATE
	CompanyInfo
SET
	UserIdD = NULL
WHERE
	UserIdD NOT IN (SELECT UserID FROM [Users])
	
UPDATE
	CompanyInfo
SET
	UserIdCpa = NULL
WHERE
	UserIdCpa NOT IN (SELECT UserID FROM [Users])
