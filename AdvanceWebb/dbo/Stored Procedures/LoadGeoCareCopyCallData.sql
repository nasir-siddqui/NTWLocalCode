




/*	Skapad av Jonas Hellstrand,     2000-12-07

 	Läser in alla nya callrecords till calldata				*/

CREATE PROCEDURE LoadGeoCareCopyCallData AS

-- Läs in alla rader
insert into tictac.callStatistic (advanceNumber, answerExtension, CallDate, CallTime, TotalCalls, AnsweredCalls, BusyCalls, NotAnsweredCalls, BlockedCalls )
	select imp.bnumber, imp.cnumber, imp.Date, imp.Time, imp.Total, imp.percentCallsAnswered, imp.percentCallsBusy, imp.percentCallsNotAnswered, imp.percentCallsCongestion
	 from tictac.importGeoCare as imp 

DECLARE @count int
set @count = (select count(*) from tictac.importGeoCare)
if @count > 0 INSERT INTO tictac.SystemLog (UserName, Process, Body) Values ('NewCallRecords', 'LoadGeoCare','New Call Records: '+ convert(varchar(10), @count))







