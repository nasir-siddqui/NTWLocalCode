


CREATE VIEW [dbo].[vCallData]
AS
SELECT     dbo.AnswerExtension.Number AS AnswerExtension,dbo.CallData.CallDateTime, dbo.CallData.Extension, CONVERT(char(11), dbo.CallData.CallDateTime, 121) AS CallDate, 
                      RIGHT('0' + CAST(DATEPART(hh, dbo.CallData.CallDateTime) AS varchar), 2) + ':' + RIGHT('0' + CAST(DATEPART(mi, dbo.CallData.CallDateTime) 
                      AS varchar), 2) + ':' + RIGHT('0' + CAST(DATEPART(ss, dbo.CallData.CallDateTime) AS varchar), 2) AS CallTime, dbo.CallData.CallDuration, 
                      dbo.CallType.CallType, dbo.AreaCode.AreaCode AS area,dbo.AreaCode.Area As Ort, dbo.Region.Region, dbo.AdvanceExtension.AdvanceExtID, 
                      dbo.AnswerExtension.AnswerExtID
FROM         dbo.AdvanceExtension INNER JOIN
                      dbo.AnswerExtension ON dbo.AdvanceExtension.AdvanceExtID = dbo.AnswerExtension.AdvanceExtId INNER JOIN
                      dbo.CallData ON dbo.AnswerExtension.AnswerExtID = dbo.CallData.AnswerExtId INNER JOIN
                      dbo.CallType ON dbo.CallData.CallTypeID = dbo.CallType.ID INNER JOIN
                      dbo.AreaCode ON dbo.CallData.AreaCode = dbo.AreaCode.AreaCode INNER JOIN
                      dbo.Region ON dbo.AreaCode.RegionId = dbo.Region.RegionId

