USE [AdvanceWebb]
GO

/****** Object:  Table [dbo].[IncludedRole]    Script Date: 11/06/2014 08:52:48 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[IncludedRole](
	[BaseRoleId] [int] NOT NULL,
	[IncludedRoleId] [int] NOT NULL
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[IncludedRole]  WITH CHECK ADD  CONSTRAINT [FK_IncludedRole_BaseRole] FOREIGN KEY([BaseRoleId])
REFERENCES [dbo].[Role] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[IncludedRole] CHECK CONSTRAINT [FK_IncludedRole_BaseRole]
GO

ALTER TABLE [dbo].[IncludedRole]  WITH CHECK ADD  CONSTRAINT [FK_IncludedRole_IncludedRole] FOREIGN KEY([IncludedRoleId])
REFERENCES [dbo].[Role] ([Id])
GO

ALTER TABLE [dbo].[IncludedRole] CHECK CONSTRAINT [FK_IncludedRole_IncludedRole]
GO


