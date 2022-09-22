


/*
 Beskrivning:
 Procedur som sammanställer samtliga behörihetsnivåer
 för de applikationer som finns upplagda för Advance.
 Lägger dessutom till behörighetsnivån 'Ingen' till samtliga 
 applikationer. Dessa rader identifieras med -1 som Id.
 In: N/A
 Ut: Postuppsättning över samtliga behörihetsnivåer
 Vem  Datum  Vad
 Mikael Arodell 2000-09-04 Första versionen
*/
CREATE PROCEDURE VIP_Select_PermissionLevels 
AS
 Select ID AS 'ApplikationID', -1 As 'Id', 0 As 'BehorighetNiva', 'Ingen' As 'Beskrivning'
 From Advance_Applikation 
 UNION 
 Select ApplikationID, Id, BehorighetNiva, Beskrivning 
 From Advance_BehorighetBeskrivning
 Order By ApplikationID, BehorighetNiva
