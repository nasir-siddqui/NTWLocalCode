-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [importCallStatistics].Trim
(
	-- Add the parameters for the function here
	@Text NVARCHAR(255)
)
RETURNS NVARCHAR(255)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @ResultVar NVARCHAR(255)


	-- Return the result of the function
	RETURN LTRIM(RTRIM(@Text))

END