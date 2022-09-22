
CREATE VIEW dbo.vCallStatisticHours
AS
SELECT DISTINCT 
                      TOP 100 PERCENT LEFT(CONVERT(varchar(13), CallDateTime, 120), 13) AS CallDateTime, SUM(TotalCalls) AS TotalCalls, 
                      ROUND(100 * CONVERT(REAL, SUM(TotalCalls * AnsweredCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS AnsweredCalls, 
                      ROUND(100 * CONVERT(REAL, SUM(TotalCalls * BusyCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS BusyCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * NotAnsweredCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS NotAnsweredCalls, ROUND(100 * CONVERT(REAL, 
                      SUM(TotalCalls * BlockedCalls / 100)) / CONVERT(REAL, SUM(TotalCalls)), 2) AS BlockedCalls, { fn HOUR(CallDateTime) } AS CallTime, 
                      AdvanceExtId
FROM         dbo.CallStatistic WITH (NOLOCK)
GROUP BY AdvanceExtId, LEFT(CONVERT(varchar(13), CallDateTime, 120), 13), { fn HOUR(CallDateTime) }

