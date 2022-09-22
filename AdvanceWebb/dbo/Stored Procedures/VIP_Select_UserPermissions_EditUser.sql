


/*
 Beskrivning:
 Procedur som sammanställer samtliga behörihetsnivåer
 för en viss användare.
 In: 
 @UserID - LoginName				!! Obs detta är den stora skillnaden mellan
 Ut: Postuppsättning över samtliga behörihetsnivåer för användaren.
 Vem  			Datum 		 Vad
 Jonas Sonberger 	2002-01-11	 Första versionen. Vid Editera användare görs sökningen på LoginName iställer för UserId.
*/
CREATE PROCEDURE VIP_Select_UserPermissions_EditUser
 @sLoginName VarChar(50)
AS
--If Not @UserID Is Null
If Exists(Select * From tictac.Users Where LoginName = @sLoginName)
 SELECT AA.ID AS AppID, AA.Applikation,  SUBSTRING(UL.Security, AA.sakkodposition, 1) AS kod 
 FROM Advance_Applikation AA, 
 Users as UL
 WHERE UL.LoginName = @sLoginName
 Order By AA.ID
Else
 Select  [ID] AS AppID, Applikation, 0 AS kod 
 From Advance_Applikation 
 Order By [ID]
