

CREATE PROCEDURE [dbo].[generateStatistics] AS


-- Updatera statistkinformationen
create table #adv (CNo int)

insert into #adv (CNo) select distinct answerExtId from calldata

update [statistics] set Value =  (select count(*) from #adv) where type = 'ActiveCNo'

update [statistics] set Value = (select count(*) from (select distinct B.AdvanceExtId from AdvanceExtension B inner join AnswerExtension C on (B.AdvanceExtId = C.AdvanceExtId) inner join #adv on (C.AnswerExtId = #adv.CNo) ) as E ) where type = 'ActiveBNo'

drop table #adv
