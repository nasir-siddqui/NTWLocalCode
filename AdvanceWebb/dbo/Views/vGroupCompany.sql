
CREATE VIEW dbo.vGroupCompany
AS
SELECT DISTINCT 
                      dbo.GroupInfo.GroupCode, dbo.GroupInfo.GroupName, dbo.CompanyInfo.CompanyName, dbo.CompanyInfo.OrgNr, dbo.[Users].Security, 
                      dbo.GroupInfo.GroupId, dbo.CompanyInfo.ActiveVIP, dbo.CompanyInfo.ActiveStat
FROM         dbo.CompanyInfo LEFT OUTER JOIN
                      dbo.GroupInfo ON dbo.GroupInfo.GroupId = dbo.CompanyInfo.GroupId LEFT OUTER JOIN
                      dbo.[Users] ON dbo.CompanyInfo.CompanyId = dbo.[Users].CompanyId

