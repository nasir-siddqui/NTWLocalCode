UPDATE AdvanceExtension
SET ChangedBy = NULL
WHERE ChangedBy NOT IN (SELECT UserId FROM [Users])
