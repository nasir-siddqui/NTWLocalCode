-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[Get7zipFileName]
	@BackupPath NVARCHAR(255)
AS
BEGIN
	DECLARE @ReturnValue NVARCHAR(255)

	SELECT TOP 1 @ReturnValue = @BackupPath + '\STAFFRAW_' + [Date] + '_230000.zip'
	FROM [importCallStatistics].[TransactionInformation] 
	WHERE Success = 1
	ORDER BY [Date] DESC

	SELECT @ReturnValue AS [7zipFileName]

END