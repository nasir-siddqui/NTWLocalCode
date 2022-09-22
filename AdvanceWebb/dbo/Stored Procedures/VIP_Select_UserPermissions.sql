


/*
 Beskrivning:
 Procedur som sammanställer samtliga behörihetsnivåer
 för en viss användare.
 In: 
 @UserID - AnvändarID
 Ut: Postuppsättning över samtliga behörihetsnivåer för användaren.
 Vem  Datum  Vad
 Mikael Arodell 2000-09-04 Första versionen
 Mikael Arodell 2000-09-05 Bytt tabell från Advance_Behorghet till enbart Webb_Users_Login
 Mikael Arodell 2000-09-06 Oavsett om användaren finns eller inte så returneras alltid en postuppsättning.
*/
CREATE PROCEDURE VIP_Select_UserPermissions
 @UserID Varchar(50)
AS
--If Not @UserID Is Null
If Exists(Select * From Users Where UserID = @UserID)
 SELECT AA.ID AS AppID, AA.Applikation,  SUBSTRING(UL.Security, AA.sakkodposition, 1) AS kod 
 FROM Advance_Applikation AA, 
 Users as UL
 WHERE UL.UserID = @UserID
 Order By AA.ID
Else
 Select  [ID] AS AppID, Applikation, 0 AS kod 
 From Advance_Applikation 
 Order By [ID]
/*
 SELECT AA.ID AS AppID, AA.Applikation,  SUBSTRING(AB.sakkod, AA.sakkodposition, 1) AS kod 
 FROM Advance_Applikation AA, 
  Advance_Behorighet AB, 
  webb_Users_Login UL
 WHERE AB.users_login_id = UL.ID AND UL.UserID = @UserID
 Order By AA.ID
*/
