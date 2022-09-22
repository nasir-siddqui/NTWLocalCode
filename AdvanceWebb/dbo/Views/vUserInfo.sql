CREATE VIEW dbo.vUserInfo
AS
SELECT     U.UserID, U.CompanyId, U.Security, US.NoOfRecords, US.Expmenu, CI.CompanyName, GI.GroupName, U.Eno, U.LoginName, U.Password, GI.GroupId, 
                      GI.GroupCode, CI.OrgNr, U.Email, U.TelNo, U.Note, U.Name, US.LogonDate, U.ProdStod, U.CreationDate, U.ChangedDate, CI.ExtendedMulti, 
                      CI.ActiveVIP, CI.ActiveStat, CI.ActiveCpa, CI.PhoneKey, ChangingUser.Name AS ChangedByName, ContactAUser.Name AS ContactAName, 
                      ContactAUser.Email AS ContactAEmail, ContactAUser.TelNo AS ContactATelNo, ContactDUser.Name AS ContactDName, 
                      ContactDUser.Email AS ContactDEmail, ContactDUser.TelNo AS ContactDTelNo, CI.UserIdA, CI.UserIdD,
	ContactCUser.Name as ContactCName, ContactCUser.Email as ContactCEmail, ContactCUser.TelNo as ContactCTelNo, CI.UserIdCpa as UserIdC
FROM         dbo.[Users] U LEFT OUTER JOIN
                      dbo.UserSettings US ON U.UserID = US.UserId INNER JOIN
                      dbo.CompanyInfo CI ON U.CompanyId = CI.CompanyId LEFT OUTER JOIN
                      dbo.[Users] ContactAUser ON CI.UserIdA = ContactAUser.UserID LEFT OUTER JOIN
                      dbo.[Users] ContactDUser ON CI.UserIdD = ContactDUser.UserID LEFT OUTER JOIN

	dbo.[Users] ContactCUser ON CI.UserIdCpa = ContactCUser.UserID LEFT OUTER JOIN

                      dbo.[Users] ChangingUser ON U.ChangedBy = ChangingUser.UserID LEFT OUTER JOIN
                      dbo.GroupInfo GI ON CI.GroupId = GI.GroupId