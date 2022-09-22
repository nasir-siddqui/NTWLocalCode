-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[GetLatestSerialNumber]
AS
BEGIN
	DECLARE @ReturnValue NVARCHAR(255)

	SELECT @ReturnValue = SerialNumber
	FROM [importCallStatistics].[TransactionInformation] 
	WHERE Success = 1
	ORDER BY  ExtractionDate

	SELECT COALESCE(@ReturnValue, '0') AS SerialNumber
END