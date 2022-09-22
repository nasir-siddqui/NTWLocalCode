-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [importCallStatistics].[GetTimeToSek]
(
	-- Add the parameters for the function here
	  @ChargeableDuration NVARCHAR(255)
)
RETURNS NVARCHAR(255)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ResultVar INT

	IF LEN(@ChargeableDuration) <> 6
	BEGIN
		SET @ResultVar = 0
	END
	ELSE
	BEGIN

		DECLARE @Hours INT
		DECLARE @Minutes INT
		DECLARE @Seconds INT

		SET @Hours = CAST(SUBSTRING(@ChargeableDuration, 0, 3) AS INT)		-- Hours
		SET @Minutes = CAST(SUBSTRING(@ChargeableDuration, 3, 2) AS INT)	-- Minutes
		SET @Seconds = CAST(SUBSTRING(@ChargeableDuration, 5, 2) AS INT)	-- Seconds

		SET @ResultVar = @Hours * 3600 + @Minutes * 60 + @Seconds

	END

	-- Return the result of the function
	RETURN @ResultVar

END