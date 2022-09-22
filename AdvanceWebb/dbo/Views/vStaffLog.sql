
CREATE VIEW dbo.vStaffLog
AS
SELECT     TOP 100 PERCENT dbo.[Users].LoginName, dbo.STAFFlog.*
FROM         dbo.STAFFlog LEFT OUTER JOIN
                      dbo.[Users] ON dbo.STAFFlog.UserId = dbo.[Users].UserID
ORDER BY dbo.STAFFlog.Id

