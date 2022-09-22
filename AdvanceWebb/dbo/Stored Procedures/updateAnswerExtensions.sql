



/*	Skapad av Jonas Hellstrand,     2000-11-02

 	Tar reda på nya kombinater av Advancenummer och Svarsställen
	uppdaterar AdvanceExtension med dessa					*/

CREATE PROCEDURE updateAnswerExtensions AS

-- Radera gammalt skräp
TRUNCATE TABLE LoadingAdvanceExtension

--Spara allla befintliga kombinationer i temorärtabellen
INSERT INTO LoadingAdvanceExtension (number, answersTo) 
	SELECT DISTINCT CDN.answerExtension, CDN.advanceExtId 
	FROM callDataNew as CDN

-- Ta bort existerande kombinationer från temporärtabellen
delete LoadingAdvanceExtension from LoadingAdvanceExtension as LAE inner join answerExtension as AE on LAE.number = AE.number and  LAE.answersTo = AE.advanceExtId

-- kopiera nya kombinationer  till orginaltabellen
insert into answerExtension (number, advanceExtId)  select number, answersTo from LoadingAdvanceExtension

-- Uppdatera answerExtension i CallDataNew
UPDATE callDataNew SET answerExtId = (select answerExtId from answerExtension AE where callDataNew.advanceExtId = AE.advanceExtId and number = answerExtension)

-- Skicka ett mail till en utvecklare?
DECLARE @count int
set @count = (select count(*) from LoadingAdvanceExtension)
if @count > 0 INSERT INTO SystemLog (UserName, Process, Body) Values ('NewAnswerExtensions', 'LoadSTAFF', convert(varchar(10), @count))
