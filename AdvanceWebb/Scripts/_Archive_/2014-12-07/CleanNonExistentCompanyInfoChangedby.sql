USE AdvanceWebb

UPDATE CompanyInfo
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserID FROM [Users])
