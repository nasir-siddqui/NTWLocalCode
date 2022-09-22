


/*
 Beskrivning:
 Procedur som hanterar samtlig uppdatering av Users (utom radering)
 In: 
 @UserID  - AnvändarID
 @Password  - Lösenord
 @Orgnr  - Organisationsnummer
 @Notering - Ev. notering om användaren.
 @Sak_Kod - Säkerhetskod
 @Name  - Användarens namn
 @Email   - Användarens e-mail.
 @Telefon - Användarens telefonnummer.
 @Eno  - Internt nummer som används i samband med inloggning från kundwebben.
 Ut: N/A
*/
CREATE PROCEDURE UserAdmin
 @UserID  int,
 @Eno   int,
 @LoginName  varchar(50),
 @Password  varchar(50) = '',
 @CompanyId  int,
 @Note varchar(255) = '',
 @Security varchar(10),
 @Name  varchar(50) = '',
 @Email   varchar(50) = '',
 @TelNo varchar(30) = '',
 @ProdStod varchar(50) = ''
AS
 -- Om @Eno skickats med så handlar det om en kundwebbsanvändare
 If @Eno <> ''
 Begin
  If Exists(Select * From Users Where Eno = @Eno)
	  Begin
	   --Print 'Update ENO-användare'
	   Update Users
		   Set --UserID = @UserID,
		         LoginName = @LoginName,
		         CompanyId = @CompanyId,
		         Security = @Security,
		         Email = @Email,
		         Note = @Note,
		         Name = @Name, 
		         TelNo = @TelNo,
		         ChangedDate = getDate()
		   Where Eno = @Eno
	  End  
  Else
	  Begin
	   --Print 'Insert ENO-användare'
	   Insert Into Users (LoginName, CompanyId, Security, Eno, Password, Name, Email, TelNo)  Values (@LoginName, @CompanyId, @Security, @Eno, 'NotInUse32!', @Name, @Email, @TelNo)
	  End 
  End 
 Else -- Annars handlar det om en 'vanlig' användare
 Begin
  If @UserId <> ''
  Begin
   --Print 'Update vanlig användare'
   Update Users
   Set CompanyId = @CompanyId,
         Security = @Security,
         Password = @Password,
         Note = @Note,
         Name = @Name,
         Email = @Email,
         TelNo = @TelNo,
         ProdStod = @ProdStod,
         ChangedDate = getDate()
--         ,LoginName = @LoginName  Ej tillåtet att uppdateras
   Where UserId = @UserId
  End 
  Else
  Begin
    --Print 'Insert vanlig användare'
    Insert Into Users (LoginName, CompanyId, Security, Password, Note, Name, Email, TelNo, Eno, ProdStod)
    Values (@LoginName, @CompanyId, @Security, @Password, @Note, @Name, @Email, @TelNo, NULL, @ProdStod)
  End
 End
