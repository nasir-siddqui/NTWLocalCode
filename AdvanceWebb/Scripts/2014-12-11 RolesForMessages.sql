USE [AdvanceWebb]
GO

/****** Object:  Table [dbo].[RolesForMessage]    Script Date: 12/11/2014 21:09:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RolesForMessage](
	[MessageId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
 CONSTRAINT [PK_RolesForMessage] PRIMARY KEY CLUSTERED 
(
	[MessageId] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[RolesForMessage]  WITH CHECK ADD  CONSTRAINT [FK_RolesForMessage_Meddelandes] FOREIGN KEY([MessageId])
REFERENCES [dbo].[Meddelandes] ([Id])
GO

ALTER TABLE [dbo].[RolesForMessage] CHECK CONSTRAINT [FK_RolesForMessage_Meddelandes]
GO

ALTER TABLE [dbo].[RolesForMessage]  WITH CHECK ADD  CONSTRAINT [FK_RolesForMessage_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([Id])
GO

ALTER TABLE [dbo].[RolesForMessage] CHECK CONSTRAINT [FK_RolesForMessage_Role]
GO


