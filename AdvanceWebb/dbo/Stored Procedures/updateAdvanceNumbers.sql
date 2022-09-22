



/*	Skapad av Jonas Hellstrand,	2000-11-02
	Ny version			2002-01-29

 	Tar reda på nya Advancenummer 
	uppdaterar AdvanceExtension med dessa					*/

CREATE PROCEDURE updateAdvanceNumbers AS

-- Radera gammalt skräp i tabellen
TRUNCATE TABLE LoadingAdvanceExtension

--Spara allla befintliga advancenummer i temorärtabellen
insert into LoadingAdvanceExtension (number) select distinct AdvanceExtension from callDataNew

-- Ta bort existerande advancenummer från temporärtabellen
delete LoadingAdvanceExtension from LoadingAdvanceExtension as ladv inner join advanceextension as adv on ladv.number = adv.number

-- kopiera nya till orginaltabellen
insert into advanceExtension (number) select distinct number from LoadingAdvanceExtension

-- Uppdatera AdvanceExtId i CallDataNew
update callDataNew set advanceExtId = (select advanceExtId from advanceExtension where number = advanceExtension)

-- Uppdatera systemlog
DECLARE @count int
set @count = (select count(*) from LoadingAdvanceExtension)
if @count > 0 INSERT INTO SystemLog (UserName, Process, Body) Values ('NewAdvanceNumbers', 'LoadSTAFF',convert(varchar(10), @count))
