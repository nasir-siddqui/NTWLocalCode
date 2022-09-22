

/*
 Beskrivning:
Raderara kopplingen mellan användare och advancenummer
skickas company id in så raderas bara kopplingar inom koncernen.

 @UserID  - AnvändarID
 @CompanyId  - FöretagsID
 Ut: N/A
*/
CREATE PROCEDURE UserDeleteAdvNr
 @UserID  int,
 @CompanyID   int
AS

 If @CompanyID <> ''
	DELETE UserAdvanceNumbers FROM UserAdvanceNumbers UAN INNER JOIN AdvanceExtension AE ON (UAN.advanceExtId = AE.advanceExtId) WHERE UAN.userid = @UserId and AE.companyid <> @CompanyId
 Else
	DELETE UserAdvanceNumbers FROM UserAdvanceNumbers  WHERE userid = @UserId
