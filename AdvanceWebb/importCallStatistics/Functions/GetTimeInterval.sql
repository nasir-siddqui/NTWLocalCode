-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [importCallStatistics].[GetTimeInterval]
(
	-- Add the parameters for the function here
	  @ChargeableDuration NVARCHAR(255)
)
RETURNS NVARCHAR(255)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ResultVar INT
	DECLARE @Intervall INT

	IF LEN(@ChargeableDuration) <> 6
	BEGIN
		SET @Intervall = 0
	END
	ELSE
	BEGIN

		DECLARE @Hours INT
		DECLARE @Minutes INT
		DECLARE @Seconds INT

		SET @Hours = CAST(SUBSTRING(@ChargeableDuration, 0, 3) AS INT)		-- Hours
		SET @Minutes = CAST(SUBSTRING(@ChargeableDuration, 3, 2) AS INT)	-- Minutes
		SET @Seconds = CAST(SUBSTRING(@ChargeableDuration, 5, 2) AS INT)	-- Seconds

		SET @Intervall = @Hours * 3600 + @Minutes * 60 + @Seconds

		SET @ResultVar = 
		CASE 
			WHEN @Intervall < 6 THEN 1
			WHEN @Intervall < 11 THEN 2
			WHEN @Intervall < 16 THEN 3
			WHEN @Intervall < 21 THEN 4
			WHEN @Intervall < 31 THEN 5
			WHEN @Intervall < 41 THEN 6
			WHEN @Intervall < 46 THEN 7
			WHEN @Intervall < 61 THEN 8
			WHEN @Intervall < 121 THEN 9
			WHEN @Intervall < 181 THEN 10
			WHEN @Intervall < 301 THEN 11
			WHEN @Intervall < 421 THEN 12
			WHEN @Intervall < 601 THEN 13
			WHEN @Intervall < 901 THEN 14
			WHEN @Intervall < 1201 THEN 15
			WHEN @Intervall < 1801 THEN 16
			WHEN @Intervall < 2401 THEN 17
			WHEN @Intervall < 2701 THEN 18
			WHEN @Intervall < 3601 THEN 19
			WHEN @Intervall < 7201 THEN 20
			WHEN @Intervall < 10801 THEN 21
			WHEN @Intervall < 18001 THEN 22
			ELSE 23
		END

	END

	-- Return the result of the function
	RETURN @ResultVar

END