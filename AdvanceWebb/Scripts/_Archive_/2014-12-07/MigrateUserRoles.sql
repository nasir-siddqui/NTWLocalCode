-- Webbstyrning läsbehörighet
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 6
FROM [Users]
WHERE SUBSTRING([Security], 1, 1) = 3

-- Webbstyrning läs/skriv
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 7
FROM [Users]
WHERE SUBSTRING([Security], 1, 1) IN (5, 7) -- Osäker på vad 7 innebär. Endast 22 användare. Kanske gammalt...

-- Multistyrning
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT [Users].UserId, 8
FROM
	[Users]
	LEFT JOIN CompanyInfo ON [Users].CompanyId = CompanyInfo.CompanyId
WHERE
	SUBSTRING([Users].[Security], 1, 1) <> 0
	AND (
		CompanyInfo.CompanyId IS NULL
		OR CompanyInfo.ExtendedMulti = 1
	)

-- Leverantörsinformation
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 9
FROM [Users]
WHERE SUBSTRING([Security], 3, 1) = 1

-- Säljare
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 2
FROM [Users]
WHERE SUBSTRING([Security], 5, 1) = 1

-- Administratör
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 3
FROM [Users]
WHERE SUBSTRING([Security], 5, 1) = 5

-- Analys
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 5
FROM [Users]
WHERE
	SUBSTRING([Security], 7, 1) <> 0
	OR SUBSTRING([Security], 9, 1) <> 0
	
-- Koncernbehörighet
INSERT INTO UsersInRoles (UserId, RoleId)
SELECT UserId, 4
FROM [Users]
WHERE SUBSTRING([Security], 8, 1) = 2