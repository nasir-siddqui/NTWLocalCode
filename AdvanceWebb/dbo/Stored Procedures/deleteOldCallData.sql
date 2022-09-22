
--  Version 1.0
--  2001-04-23 Jonas Hellstrand
--
--	Version 1.1
--	2015-06-18 Jeremia Mörling, jeremia.morling@sigma.se
--	Originally written with datediff in the delete statement. This executes a function for all rows in the whole table.
--	Rewrote to calculate old date and make a simple comparison instead
CREATE PROCEDURE [dbo].[deleteOldCallData] AS

-- Date 15 months ago
DECLARE
	@Date15MonthsAgo	SMALLDATETIME = DATEADD(MONTH, -15, GETDATE()),
	@Date3MonthsAgo		SMALLDATETIME = DATEADD(MONTH, -3, GETDATE())

-- Delete all records older than 15 months
DELETE CallData 
WHERE CallDate < @Date15MonthsAgo

INSERT INTO systemlog (UserName, Process, Body) values ('DeleteCallData15m', 'DeleteSTAFF', convert(varchar(10), @@ROWCOUNT))

-- Delete all records older than 3 months for users who don´t pay...
DELETE CallData
FROM
	AdvanceExtension ADV
	INNER JOIN AnswerExtension ANS
		ON ADV.subscribed = '0'
		AND ANS.advanceExtId = ADV.advanceExtId
	INNER JOIN CallData CD
		ON CD.answerExtId = ANS.answerExtId
WHERE
	CD.CallDate < @Date3MonthsAgo
--OPTION (FORCE ORDER)

insert into systemlog (UserName, Process, Body) values ('DeleteCallData3m', 'DeleteSTAFF', convert(varchar(10), @@ROWCOUNT))