



/*
 *	Procedure takes in an arbitrary string as a foreign org.no. and retuns a fictive but "correct " swedish organisationsnummer.
 *	The same input string ALWAYS returns the SAME fictive organisationsnummer
 *	Characters ' ', '-' are removed from the input string
 *
 */
CREATE    PROCEDURE sp_GenerateFictiveOrgNr 
	
	@foreignOrgNr nvarchar(50)
--	@tmp varchar(10) OUTPUT
		
AS
	DECLARE @prefix as nchar(4)
	SET @prefix = '0092'

	DECLARE @foreignOrgNr2 nvarchar(50)
	--Remove all ' ', '-'
	
	SET @foreignOrgNr2 = @foreignOrgNr
	
	SET @foreignOrgNr2 = REPLACE(@foreignOrgNr2, ' ', '') --Replace spaces
	SET @foreignOrgNr2 = REPLACE(@foreignOrgNr2, '-', '') --Replace '-'

	IF (@foreignOrgNr2 IN ( SELECT ForeignOrgNr FROM FictiveOrgNr ))
		BEGIN
			SELECT FictiveOrgNr as 'FictiveOrgNr'  FROM FictiveOrgNr WHERE (ForeignOrgNr = @foreignOrgNr2 )
			RETURN 0

		END

	-- ELSE
	-- Creat a new id
	DECLARE @newFictiveId char(10)
	DECLARE @lastCounter int
	
	--@last counter is the last order nr used by this procedure
	SET @lastCounter = (SELECT ISNULL(MAX([Counter]), 0) FROM [FictiveOrgNr])
	--SELECT @lastCounter as 'last counter'

	-- Concat prefix (0092) and <beginning 0's> and <Counter>
	SET @newFictiveId = @prefix + RIGHT('0000000000' + CAST(@lastCounter AS varchar(255)), 5) --Create digits 0092*****C (C = Control digit)
	
	-- Add th last digit i.e. the Control digit
	DECLARE @controlDigit int
	DECLARE @tmpInt int
	SET @controlDigit = 0

	-- 1
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 1, 1) as int)) * 2)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 2
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 2, 1) as int)) * 1)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 3
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 3, 1) as int)) * 2)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 4
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 4, 1) as int)) * 1)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 5
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 5, 1) as int)) * 2)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 6
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 6, 1) as int)) * 1)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 7
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 7, 1) as int)) * 2)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)
	
	-- 8
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 8, 1) as int)) * 1)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- 9
	SET @tmpInt = ((CAST(SUBSTRING(@newFictiveId, 9, 1) as int)) * 2)
	SET @controlDigit = @controlDigit + (@tmpInt / 10) + (@tmpInt % 10)

	-- Hmm round of to upper 10-tal and subtract controlDigits Current value
	SET @tmpInt = (10 - (@controlDigit % 10)) % 10
	SET @newFictiveId = (RTRIM(@newFictiveId) + CAST(@tmpInt AS varchar))
	
	INSERT INTO [FictiveOrgNr] ([Counter], [ForeignOrgNr], [FictiveOrgNr]) VALUES (@lastCounter + 1, @foreignOrgNr2, @newFictiveId)

	SELECT @newFictiveId as 'FictiveOrgNr'
	RETURN 0
--return @tmpInt




GO
GRANT EXECUTE
    ON OBJECT::[dbo].[sp_GenerateFictiveOrgNr] TO PUBLIC
    AS [dbo];

