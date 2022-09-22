-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[FinishTransaction]
	-- Add the parameters for the stored procedure here
	  @SerialNumber NVARCHAR(255)
	, @Success BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @Success = 1
		BEGIN
			
			DECLARE @exportedRows INT
			DECLARE @readRowsFromFile INT
			DECLARE @rowsInFile INT

			-- Esported Rows
			SELECT @readRowsFromFile =  COUNT(*) FROM [importCallStatistics].TransactionData
			SELECT @exportedRows =  COUNT(*) FROM [importCallStatistics].TransactionData WHERE @Success = 1

			-- Update TransactionInformation
			UPDATE [importCallStatistics].[TransactionInformation]
			SET   ExportedRows = @exportedRows
				, ReadRowsFromFile = @readRowsFromFile
				, Success = @Success
				, [Message] = 'File parsed: ' + [FileName] + ' ' + CAST(@exportedRows AS NVARCHAR(10)) + ' rows'
			WHERE Id IN ( SELECT TOP 1 Id FROM [importCallStatistics].[TransactionInformation] WHERE SerialNumber = @SerialNumber ORDER BY ExtractionDate ASC)

		END
	ELSE
		BEGIN
			
			IF NOT EXISTS (SELECT * FROM [importCallStatistics].[TransactionInformation] WHERE SerialNumber = @SerialNumber)
			BEGIN
				INSERT INTO [importCallStatistics].TransactionInformation(SerialNumber) VALUES(@SerialNumber)
			END

			-- Update failed transaktion information
			UPDATE [importCallStatistics].[TransactionInformation]
			SET [Message] = 'ERROR: Parsing of file failed'
			WHERE Id IN ( SELECT TOP 1 Id FROM [importCallStatistics].[TransactionInformation] WHERE SerialNumber = @SerialNumber ORDER BY ExtractionDate ASC)

		END

	-- Truncate Transactions table
	TRUNCATE TABLE [importCallStatistics].[TransactionData]

END