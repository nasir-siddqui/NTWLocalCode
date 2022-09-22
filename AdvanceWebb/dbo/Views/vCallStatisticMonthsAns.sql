
CREATE VIEW dbo.vCallStatisticMonthsAns
AS
SELECT DISTINCT 
                      TOP 100 PERCENT LEFT(CONVERT(varchar(7), CallDateTime, 120), 7) AS CallMonth, SUM(TotalCalls) AS TotalCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * AnsweredCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS AnsweredCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * BusyCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS BusyCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * NotAnsweredCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS NotAnsweredCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * BlockedCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS BlockedCalls, AnswereExtId
FROM         dbo.CallStatistic WITH (NOLOCK)
GROUP BY AnswereExtId, LEFT(CONVERT(varchar(7), CallDateTime, 120), 7)

