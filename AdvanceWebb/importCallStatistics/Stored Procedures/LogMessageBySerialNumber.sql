-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[LogMessageBySerialNumber]
	-- Add the parameters for the stored procedure here
	@SerialNumber NVARCHAR(255)
	, @Message NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF(@SerialNumber IS NOT NULL AND @SerialNumber <> '')
	BEGIN
		IF EXISTS(SELECT * FROM [importCallStatistics].[TransactionInformation] WHERE SerialNumber = @SerialNUmber)
		BEGIN
			UPDATE [importCallStatistics].[TransactionInformation] SET [Message] = @Message 
			WHERE Id IN ( SELECT TOP 1 Id FROM [importCallStatistics].[TransactionInformation] WHERE SerialNumber = @SerialNumber ORDER BY ExtractionDate ASC)
		END
		ELSE
		BEGIN
			INSERT INTO [importCallStatistics].[TransactionInformation] (SerialNumber, [Message])
			VALUES(@SerialNumber, @Message)
		END
	END
	ELSE
	BEGIN
		INSERT INTO [importCallStatistics].[TransactionInformation] (SerialNumber, [Message])
		VALUES('Okänt', @Message)
	END
END