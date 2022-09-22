USE AdvanceWebb

UPDATE [AdvanceExtension]
SET CompanyId = NULL
WHERE
	CompanyId = 0
	OR CompanyId NOT IN (SELECT CompanyId FROM CompanyInfo)