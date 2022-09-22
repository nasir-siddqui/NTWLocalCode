


/*
 *	Procedure gets the foreign orgnr from the fictive orgnr
 *
 */
CREATE   PROCEDURE sp_GetForeignOrgNr 
	
	@fictiveOrgNr nvarchar(50)
		
AS
	SELECT ForeignOrgNr FROM FictiveOrgNr WHERE FictiveOrgNr = @fictiveOrgNr 



GO
GRANT EXECUTE
    ON OBJECT::[dbo].[sp_GetForeignOrgNr] TO PUBLIC
    AS [dbo];

