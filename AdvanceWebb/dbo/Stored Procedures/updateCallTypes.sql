

/*	Skapad av Jonas Hellstrand,     2000-11-02

 	Tar reda på nya CallTypes
	uppdaterar CallType-tabellen med dessa					*/

CREATE PROCEDURE updateCallTypes AS
DECLARE @count int


Create table #t (id smallint PRIMARY KEY, callType varchar (10))

--Spara allla befintliga calltypes i temorärtabellen
insert into #t (id, calltype) select distinct CDN.calltypeId, CDN.calltypeId from callDataNew as CDN

-- Ta bort existerande calltypes från temporärtabellen
delete #t from #t as lc inner join calltype as ac on lc.id = ac.id

-- kopiera nya till orginaltabellen
insert into calltype (id, calltype) select distinct calltype, calltype from #t

-- Skicka ett mail till en utvecklare?
set @count = (select count(*) from #t)
if @count > 0 INSERT INTO SystemLog (UserName, Process, Body) Values ('NewCallTypes', 'LoadSTAFF',convert(varchar(10), @count))

drop table #t
