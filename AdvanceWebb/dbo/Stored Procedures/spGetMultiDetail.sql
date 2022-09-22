



CREATE   PROCEDURE spGetMultiDetail
@userId integer,
@id integer
AS


SELECT Abonnemang, max(localId) localId, Name, AlternativNamn FROM vStaffMulti WHERE UserId = @userId AND status <> 'D' AND Id = @id
group by Abonnemang,Name,AlternativNamn
union
select Q.Abonnemang, max(localId) localId, Name, AlternativNamn  from 
	(SELECT Abonnemang, localId, Name, min(AlternativNamn) as AlternativNamn FROM STAFFDetail D INNER JOIN STAFFServices S ON (S.abonnemangsId = D.serviceId) WHERE UserId = @userId AND status <> 'D' AND D.Id = @id group by Abonnemang, localId, Name ) q left join
	(SELECT Abonnemang FROM vStaffMulti  WHERE UserId = @userId AND status <> 'D' AND Id = @id) W on (q.Abonnemang = w.abonnemang)
where w.abonnemang is null
group by q.Abonnemang,Name,AlternativNamn
ORDER BY Abonnemang

