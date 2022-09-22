CREATE VIEW cube.Numbers
AS
SELECT     dbo.AnswerExtension.AnswerExtID, dbo.AnswerExtension.Number AS AnswNumber, dbo.AnswerExtension.CreationDate AS AnswCreationDate, 
                      dbo.AdvanceExtension.AdvanceExtID, dbo.AdvanceExtension.Active, dbo.AdvanceExtension.IntervalLow, dbo.AdvanceExtension.IntervalHigh, 
                      dbo.AdvanceExtension.Subscribed, dbo.AdvanceExtension.CompanyId, dbo.AdvanceExtension.ChangedDate, dbo.AdvanceExtension.ChangedBy, 
                      dbo.AdvanceExtension.AnalysisView, dbo.AdvanceExtension.AnalysisRawdata, dbo.AdvanceExtension.Number AS AdvNumber, 
                      dbo.AdvanceExtension.CreationDate AS AdvCreationDate
FROM         dbo.AnswerExtension LEFT OUTER JOIN
                      dbo.AdvanceExtension ON dbo.AnswerExtension.AdvanceExtId = dbo.AdvanceExtension.AdvanceExtID

GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[30] 4[40] 2[11] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "AnswerExtension"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 217
               Right = 189
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "AdvanceExtension"
            Begin Extent = 
               Top = 6
               Left = 227
               Bottom = 258
               Right = 389
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 2160
         Table = 2340
         Output = 1455
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'cube', @level1type = N'VIEW', @level1name = N'Numbers';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 1, @level0type = N'SCHEMA', @level0name = N'cube', @level1type = N'VIEW', @level1name = N'Numbers';

