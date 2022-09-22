



/*	Skapad av Jonas Hellstrand,     2000-12-05

 	Läser in en semikolonseparerad textfil till importStaff				
    
	IN: FileName	Filnamn exklusive path

 	OBS: Pathen är hårdkodad till  F:\FTP\AdvanceGeoCare\	*/

CREATE PROCEDURE LoadGeoCareBulkInsert 
@FileName varchar(200)
AS

-- Läs in den nya filen
Exec ('BULK INSERT tictac.importGeoCare FROM ''F:\FTP\AdvanceGeoCare\' + @FileName + ''' WITH (CODEPAGE=''ACP'',FIELDTERMINATOR='';'',ROWTERMINATOR = ''\n'')')














