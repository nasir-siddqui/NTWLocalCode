


CREATE PROCEDURE [dbo].[changeENO2Name] AS

update Webb_Users_Login set Namn = UserId where left(Namn,3)='ENO'
