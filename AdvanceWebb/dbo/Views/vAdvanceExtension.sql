
CREATE VIEW dbo.vAdvanceExtension
AS
SELECT DISTINCT dbo.GroupInfo.GroupCode, dbo.CompanyInfo.CompanyName, dbo.AdvanceExtension.Number,
                          (SELECT     COUNT(UserAdvanceNumbers.UserID)
                            FROM          UserAdvanceNumbers
                            WHERE      AdvanceExtension.AdvanceExtID = UserAdvanceNumbers.AdvanceExtID) AS Connected, dbo.CompanyInfo.OrgNr, 
                      dbo.AdvanceExtension.CompanyId, dbo.AdvanceExtension.AdvanceExtID, dbo.AdvanceExtension.CreationDate, dbo.AdvanceExtension.ChangedDate, 
                      dbo.AdvanceExtension.ChangedBy, dbo.AdvanceExtension.Subscribed, dbo.AdvanceExtension.AnalysisView, 
                      dbo.AdvanceExtension.AnalysisRawData
FROM         dbo.AdvanceExtension LEFT OUTER JOIN
                      dbo.CompanyInfo ON dbo.AdvanceExtension.CompanyId = dbo.CompanyInfo.CompanyId LEFT OUTER JOIN
                      dbo.GroupInfo ON dbo.CompanyInfo.GroupId = dbo.GroupInfo.GroupId LEFT OUTER JOIN
                      dbo.UserAdvanceNumbers ON dbo.AdvanceExtension.AdvanceExtID = dbo.UserAdvanceNumbers.AdvanceExtId

