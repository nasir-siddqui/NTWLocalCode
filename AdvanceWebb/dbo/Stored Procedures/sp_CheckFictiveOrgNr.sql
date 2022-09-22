



CREATE   PROCEDURE sp_CheckFictiveOrgNr 
	
	@foreignOrgNr nvarchar(50)
		
AS

	declare @resultValue as char(1)
	if exists ( select foreignOrgNr FROM [dbo].[FictiveOrgNr] where foreignOrgNr = @foreignOrgNr )
		set @resultValue = 1
	Else
		set @resultValue = 0

	select @resultValue as 'Message'





GO
GRANT EXECUTE
    ON OBJECT::[dbo].[sp_CheckFictiveOrgNr] TO PUBLIC
    AS [dbo];

