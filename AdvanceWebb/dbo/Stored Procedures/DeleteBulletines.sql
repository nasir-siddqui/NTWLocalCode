

CREATE PROCEDURE DeleteBulletines
AS
DELETE FROM Bulletines
WHERE (EndDate-5) <= GetDate()


