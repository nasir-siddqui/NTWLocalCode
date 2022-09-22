
CREATE VIEW dbo.vCallStatisticMonths
AS
SELECT DISTINCT 
                      TOP 100 PERCENT LEFT(CONVERT(varchar(7), dbo.CallStatistic.CallDateTime, 120), 7) AS CallMonth, SUM(dbo.CallStatistic.TotalCalls) AS TotalCalls, 
                      ROUND(100 * CONVERT(REAL, SUM(dbo.CallStatistic.TotalCalls * dbo.CallStatistic.AnsweredCalls / 100)) / CONVERT(REAL, 
                      SUM(dbo.CallStatistic.TotalCalls)), 2) AS AnsweredCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(dbo.CallStatistic.TotalCalls * dbo.CallStatistic.BusyCalls / 100)) / CONVERT(REAL, SUM(dbo.CallStatistic.TotalCalls)), 2) AS BusyCalls, 
                      ROUND(100 * CONVERT(REAL, SUM(dbo.CallStatistic.TotalCalls * dbo.CallStatistic.NotAnsweredCalls / 100)) / CONVERT(REAL, 
                      SUM(dbo.CallStatistic.TotalCalls)), 2) AS NotAnsweredCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(dbo.CallStatistic.TotalCalls * dbo.CallStatistic.BlockedCalls / 100)) / CONVERT(REAL, SUM(dbo.CallStatistic.TotalCalls)), 2) AS BlockedCalls, 
                      dbo.CallStatistic.AdvanceExtId, dbo.AnswerExtension.Number AS AnswerExtension
FROM         dbo.CallStatistic WITH (NOLOCK) LEFT OUTER JOIN
                      dbo.AnswerExtension ON dbo.CallStatistic.AnswereExtId = dbo.AnswerExtension.AnswerExtID
GROUP BY dbo.CallStatistic.AdvanceExtId, LEFT(CONVERT(varchar(7), dbo.CallStatistic.CallDateTime, 120), 7), dbo.AnswerExtension.Number

