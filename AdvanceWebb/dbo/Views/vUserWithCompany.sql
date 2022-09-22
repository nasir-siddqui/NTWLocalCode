
CREATE VIEW dbo.vUserWithCompany
AS
SELECT     dbo.[Users].UserID, dbo.[Users].LoginName, ISNULL(dbo.[Users].CompanyId, 0) AS CompanyId, ISNULL(dbo.CompanyInfo.CompanyName, '') 
                      AS companyname, dbo.CompanyInfo.OrgNr, dbo.[Users].Eno, dbo.[Users].Name
FROM         dbo.[Users] LEFT OUTER JOIN
                      dbo.CompanyInfo ON dbo.[Users].CompanyId = dbo.CompanyInfo.CompanyId

