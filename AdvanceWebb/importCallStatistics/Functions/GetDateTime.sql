-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [importCallStatistics].[GetDateTime]
(
	-- Add the parameters for the function here
	  @ChargeDayStart NVARCHAR(255)
	, @ChargeDayEnd NVARCHAR(255)
)
RETURNS NVARCHAR(255)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ResultVar NVARCHAR(255)

	-- Add the T-SQL statements to compute the return value here
	SET @ResultVar = 
		  SUBSTRING(@ChargeDayStart, 0, 5)	-- Year
		+ '-'
		+ SUBSTRING(@ChargeDayStart, 5, 2)	-- Month
		+ '-'
		+ SUBSTRING(@ChargeDayStart, 7, 2)	-- Day
		+ ' '
		+ SUBSTRING(@ChargeDayEnd, 0, 3)	-- Hour
		+ ':'
		+ SUBSTRING(@ChargeDayEnd, 3, 2)	-- Minutes
		+ ':'
		+ SUBSTRING(@ChargeDayEnd, 5, 2)	-- MilliSeconds

	-- Return the result of the function
	RETURN @ResultVar

END