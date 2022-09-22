CREATE TABLE [dbo].[UsersInRoles] (
    [UserId] INT NOT NULL,
    [RoleId] INT NOT NULL,
    CONSTRAINT [PK_UsersInRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_UsersInRoles_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UsersInRoles_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE
);









