-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[CreateExportData]
AS
BEGIN

	BEGIN TRY
		BEGIN TRAN
			
			INSERT INTO [importCallStatistics].[ExportData]
			SELECT 
					  LEFT(ANumber, 5) AS ANumber
					, [importCallStatistics].Trim(BNumber) AS BNumber
					, [importCallStatistics].Trim(CNumber) AS CNumber
					, [importCallStatistics].[GetDateTime](ChargeDayStart, ChargeTimeStart) AS ChargeStartTime
					, [importCallStatistics].[GetDateHour](ChargeDayStart, ChargeTimeStart) AS ChargeStartHour
					, [importCallStatistics].[GetTimeToSek](ChargeableDuration) AS ChargeableDuration
					, [importCallStatistics].[GetTimeInterval](ChargeableDuration) AS ChargeableDurationIntervall
					, [importCallStatistics].Trim(CallType)
					, AreaId
					, AreaCode
			FROM [importCallStatistics].[TransactionData]

		COMMIT TRAN
	END TRY
	BEGIN CATCH

		IF @@TRANCOUNT > 0 ROLLBACK

	END CATCH
	

END