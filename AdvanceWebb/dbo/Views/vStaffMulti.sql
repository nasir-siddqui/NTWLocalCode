
CREATE VIEW dbo.vStaffMulti
AS
SELECT     S.Abonnemang, D.localId, D.name, S.Alternativnamn, D.UserId, D.id, D.status
FROM         dbo.STAFFDetail D INNER JOIN
                      dbo.STAFFServices S ON D.connectLinkId = S.Id

