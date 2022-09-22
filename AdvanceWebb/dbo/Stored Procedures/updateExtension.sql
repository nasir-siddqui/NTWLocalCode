

CREATE PROCEDURE [dbo].[updateExtension] AS

DECLARE @count int

Create table #t (extension char (5) PRIMARY KEY, areaId int)

insert into #t (extension, AreaId)  (select distinct extension, areaId from callDataNew)

delete #t from #t inner join extension E ON #t.extension COLLATE DATABASE_DEFAULT = E.extension COLLATE DATABASE_DEFAULT

insert into extension (extension, areaId) select extension, areaId from #t

set @count = (select count(*) from #t)
if @count > 0 INSERT INTO SystemLog (UserName, Process, Body) Values ('NewExtensions', 'LoadSTAFF',convert(varchar(10), @count))

drop table #t
