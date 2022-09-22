
CREATE VIEW dbo.vSupportLog
AS
SELECT     TOP 100 PERCENT dbo.[Users].LoginName, dbo.SupportLog.*
FROM         dbo.SupportLog LEFT OUTER JOIN
                      dbo.[Users] ON dbo.SupportLog.UserId = dbo.[Users].UserID
ORDER BY dbo.SupportLog.Id

