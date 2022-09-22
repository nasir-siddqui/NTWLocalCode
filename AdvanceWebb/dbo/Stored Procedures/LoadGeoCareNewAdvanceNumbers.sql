



/*	Skapad av Jonas Hellstrand,     2000-11-02

 	Tar reda på nya Advancenummer 
	uppdaterar AdvanceExtension med dessa					*/

CREATE PROCEDURE [dbo].LoadGeoCareNewAdvanceNumbers AS

--Spara allla befintliga advancenummer i temorärtabellen
insert into tictac.LoadingAdvanceExtension (number) select distinct bnumber from tictac.importGeoCare

-- Ta bort existerande calltypes från temporärtabellen
delete tictac.LoadingAdvanceExtension from tictac.LoadingAdvanceExtension as ladv inner join tictac.advanceextension as adv on ladv.number = adv.number

-- kopiera nya till orginaltabellen
insert into tictac.advanceExtension (number) select distinct number from tictac.LoadingAdvanceExtension

-- Skicka ett mail till en utvecklare?
DECLARE @count int
set @count = (select count(*) from tictac.LoadingAdvanceExtension)
if @count > 0 INSERT INTO tictac.SystemLog (UserName, Process, Body) Values ('NewAdvanceNumbers', 'LoadGeoCare',convert(varchar(10), @count))










