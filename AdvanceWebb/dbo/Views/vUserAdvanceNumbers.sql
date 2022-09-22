
CREATE VIEW dbo.vUserAdvanceNumbers
AS
SELECT DISTINCT UAN.AdvanceExtId, UAN.UserID, AE.CompanyId, AE.Number, UAN.AnalysisView, UAN.AnalysisRawData, dbo.[Users].Security
FROM         dbo.UserAdvanceNumbers UAN INNER JOIN
                      dbo.AdvanceExtension AE ON UAN.AdvanceExtId = AE.AdvanceExtID INNER JOIN
                      dbo.[Users] ON UAN.UserID = dbo.[Users].UserID

