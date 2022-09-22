Use AdvanceWebb

Insert into [UsersInRoles] (UserId, RoleId)
Select distinct UI.UserId, 1
FROM [Users] AS U
Left JOIN [UsersInRoles] AS UI
	ON UI.UserId = U.UserID
LEFT JOIN CompanyInfo
	ON U.CompanyId = CompanyInfo.CompanyId
WHERE CompanyInfo.OrgNr <> '999999-9999'
AND Ui.UserId Not in (Select UserId From UsersInRoles Where RoleId = 1)