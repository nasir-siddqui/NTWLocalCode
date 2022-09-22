
CREATE PROCEDURE [dbo].[CopyDEMO] AS

-- ************* 020- DEMO **************

-- Kopiera orginalposter till demonummret
insert into callDataNew (AdvanceExtension, AdvanceExtId, AnswerExtension, AnswerExtId, AreaCode, AreaId, CallDate, CallDateTime, CallDuration, CallTypeID, Extension, IntervalId)
select '020-DEMO', AdvanceExtId, AnswerExtension, AnswerExtId, AreaCode, AreaId, CallDate, CallDateTime, CallDuration, CallTypeID, Extension, IntervalId 
from calldataNew where advanceExtension = '020988988'

-- Ändra Svarsställen
update callDataNew set AnswerExtension = 'SVARSNR 1' where advanceExtension = '020-DEMO' and answerExtension = '084665956'
update callDataNew set AnswerExtension = 'SVARSNR 2' where advanceExtension = '020-DEMO' and answerExtension = '087074580'
update callDataNew set AnswerExtension = 'SVARSNR 3' where advanceExtension = '020-DEMO' and left(answerExtension,1) <> 'S'


-- ************* 0771- DEMO **************

-- Kopiera orginalposter till demonummret
insert into callDataNew (AdvanceExtension, AdvanceExtId, AnswerExtension, AnswerExtId, AreaCode, AreaId, CallDate, CallDateTime, CallDuration, CallTypeID, Extension, IntervalId)
select '0771-DEMO', AdvanceExtId, AnswerExtension, AnswerExtId, AreaCode, AreaId, CallDate, CallDateTime, CallDuration, CallTypeID, Extension, IntervalId 
from calldataNew where advanceExtension = '0771212123'

-- Ändra Svarsställen
update callDataNew set AnswerExtension = 'SVARSNR 1' where advanceExtension = '0771-DEMO' and answerExtension = '0680716638'
update callDataNew set AnswerExtension = 'SVARSNR 2' where advanceExtension = '0771-DEMO' and answerExtension = '0651768680'
update callDataNew set AnswerExtension = 'SVARSNR 3' where advanceExtension = '0771-DEMO' and answerExtension = '0680716636'
update callDataNew set AnswerExtension = 'SVARSNR 4' where advanceExtension = '0771-DEMO' and left(answerExtension,1) <> 'S'
