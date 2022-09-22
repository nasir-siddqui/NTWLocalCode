


CREATE PROCEDURE dbo.deleteAnswereExtensions AS


delete from answerExtension where AnswerExtId in
(select 
	distinct res.AnswerExtId
from 
	(select 
		distinct aecs.AnswerExtId
	from
		(select 
			distinct ae.AnswerExtId
		from 
			tictac.answerExtension as ae left join
			tictac.callstatistic as cs on (ae.AnswerExtId = cs.AnswereExtId)
		where 
			cs.TotalCalls is null) as aecs left join
		tictac.calldata as cd on (aecs.AnswerExtId = cd.AnswerExtId) 
	where 
		cd.CallDateTime is null) as res)

insert into tictac.systemlog (UserName, Process, Body) values ('deleteAnswereExtensions', 'Maintenance',  convert(varchar(10), @@ROWCOUNT))
