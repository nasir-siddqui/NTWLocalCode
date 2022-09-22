


--  Version 1.0
--  2001-04-23 Jonas Hellstrand 
--
CREATE PROCEDURE dbo.deleteOldCallStatistic AS


-- Delete all records older than 15 months
delete callstatistic
where datediff(month, calldateTime, getdate()) > 15

insert into systemlog (UserName, Process, Body) values ('deleteOldCallStatistic', 'DeleteGEOCARE', '(> 15 months) ' + convert(varchar(10), @@ROWCOUNT))

-- Delete all records older than 3 months for users who don´t pay...
delete callstatistic
from callstatistic as cs inner join advanceextension as ae on (cs.advanceExtId = ae.advanceExtId )
where subscribed = '0' and datediff(month, calldateTime, getdate()) > 3
--datediff(day, calldateTime, getdate()) > 92

insert into systemlog (UserName, Process, Body) values ('deleteOldCallStatistic', 'DeleteGEOCARE', '(> 3 months) ' + convert(varchar(10), @@ROWCOUNT))