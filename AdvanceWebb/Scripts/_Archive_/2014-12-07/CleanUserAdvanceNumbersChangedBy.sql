USE AdvanceWebb

UPDATE UserAdvanceNumbers
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserID FROM [Users])
