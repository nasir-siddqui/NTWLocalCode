USE AdvanceWebb

-- Reference Data for Status
MERGE INTO [IncludedRole] AS Target 
USING (VALUES
	-- Webbstyrning
	(7,	6),
	(8,	7)
) 
AS Source (BaseRoleId, IncludedRoleId) 
ON Target.BaseRoleId = Source.BaseRoleId
	AND Target.IncludedRoleId = Source.IncludedRoleId

--insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (BaseRoleId, IncludedRoleId) 
VALUES (BaseRoleId, IncludedRoleId)

--delete rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN 
DELETE
;