USE AdvanceWebb

-- Reference Data for Status
MERGE INTO [Role] AS Target 
USING (VALUES
	(1,	'Kund',							NULL,	NULL),
	(2,	'Säljare',						NULL,	NULL),
	(3,	'Administratör',				NULL,	NULL),
	(4,	'Koncernrättigheter',			NULL,	NULL),
	(5,	'Analys',						NULL,	1),
	(6, 'Webbstyrning',					NULL,	1),
	(7, 'Webbstyrning_Write',			NULL,	1),
	(8, 'Webbstyrning_Multistyrning',	NULL,	1),
	(9,	'Leverantörsinformation',		NULL,	1)
) 
AS Source (Id, Name, [Description], ApplicationRole) 
ON Target.Id = Source.Id

-- update matched rows 
WHEN MATCHED THEN
UPDATE SET
	Name = Source.Name,
	[Description] = Source.[Description],
	ApplicationRole = Source.ApplicationRole

--insert new rows 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (Id, Name, [Description], ApplicationRole) 
VALUES (Id, Name, [Description], ApplicationRole)

--delete rows that are in the target but not the source 
WHEN NOT MATCHED BY SOURCE THEN 
DELETE
;