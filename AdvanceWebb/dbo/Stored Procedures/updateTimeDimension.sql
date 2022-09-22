

CREATE PROCEDURE [dbo].[updateTimeDimension] AS

DECLARE @count int

Create table #t (callDate smallDateTime PRIMARY KEY)

insert into #t (callDate)  (
select distinct callDate from callDataNew)

delete #t from #t inner join timeDimension TD ON #t.callDate = TD.dateTime

insert into timeDimension (dateTime) select callDate from #t

set @count = (select count(*) from #t)
if @count > 0 INSERT INTO SystemLog (UserName, Process, Body) Values ('NewCallTimes', 'LoadSTAFF',convert(varchar(10), @count))

drop table #t
