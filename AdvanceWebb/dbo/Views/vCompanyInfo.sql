CREATE VIEW dbo.vCompanyInfo
AS
SELECT     CI.CompanyName, CI.OrgNr, CI.Country, GI.GroupName, GI.GroupCode, CI.EDI, CI.PhoneKey, CI.ActiveVIP, CI.ActiveStat, CI.ActiveCpa, CI.CreationDate, 
                      CI.ChangedDate, CI.New, CI.CompanyId, CI.ExtendedMulti, UA.Name AS NameA, UA.TelNo AS TelNoA, UA.Email AS EmailA, Ud.Name AS nameD,
                      Ud.Email AS EmailD, Ud.TelNo AS TelNoD, CI.ChangedBy, 
		 UC.Name as NameC, UC.Email AS EmailC, UC.TelNo AS TelNoC,
		CI.UserIdA, CI.UserIdD, CI.UserIdCpa
FROM         dbo.CompanyInfo CI LEFT OUTER JOIN
                      dbo.[Users] UA ON CI.UserIdA = UA.UserID LEFT OUTER JOIN
                      dbo.GroupInfo GI ON CI.GroupId = GI.GroupId LEFT OUTER JOIN
                      dbo.[Users] Ud ON CI.UserIdD = Ud.UserID LEFT OUTER JOIN
		dbo.[Users] UC on CI.UserIdCpa = UC.UserID
