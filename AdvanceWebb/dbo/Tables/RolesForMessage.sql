CREATE TABLE [dbo].[RolesForMessage] (
    [MessageId] INT NOT NULL,
    [RoleId]    INT NOT NULL,
    CONSTRAINT [PK_RolesForMessage] PRIMARY KEY CLUSTERED ([MessageId] ASC),
    CONSTRAINT [FK_RolesForMessage_Meddelandes] FOREIGN KEY ([MessageId]) REFERENCES [dbo].[Meddelandes] ([Id]),
    CONSTRAINT [FK_RolesForMessage_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id])
);



