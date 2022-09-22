-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [importCallStatistics].[UpdateAreaCodes]
AS
BEGIN
	
	WITH TransactionCodes(ANumber, Code, Id) 
	AS 
	(
		SELECT DISTINCT
			ANumber,
			CASE
				WHEN ac.AreaCode IS NULL THEN '99'
				ELSE ac.AreaCode END,
			CASE
				WHEN ac.AreaId IS NULL THEN 269
				ELSE ac.AreaId END
		FROM
			[importCallStatistics].TransactionData td
			LEFT JOIN [dbo].AreaCode ac
				ON '0' + LEFT(td.ANumber, 3) = ac.AreaCode
				OR (
					'0' + LEFT(td.ANumber, 2) = ac.AreaCode
					AND NOT '0' + LEFT(td.ANumber, 3) = ac.AreaCode
				)
				OR (
					'0' + LEFT(td.ANumber, 1) = ac.AreaCode
					AND NOT '0' + LEFT(td.ANumber, 2) = ac.AreaCode
					AND NOT '0' + LEFT(td.ANumber, 3) = ac.AreaCode
				)
	)
	
	UPDATE [importCallStatistics].[TransactionData]
	SET
		AreaCode = TransactionCodes.Code,
		AreaId = TransactionCodes.Id
	FROM TransactionCodes
	WHERE TransactionData.ANumber = TransactionCodes.ANumber

END