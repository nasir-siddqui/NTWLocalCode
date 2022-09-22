CREATE TABLE [dbo].[IncludedRole] (
    [BaseRoleId]     INT NOT NULL,
    [IncludedRoleId] INT NOT NULL,
    CONSTRAINT [FK_IncludedRole_BaseRole] FOREIGN KEY ([BaseRoleId]) REFERENCES [dbo].[Role] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_IncludedRole_IncludedRole] FOREIGN KEY ([IncludedRoleId]) REFERENCES [dbo].[Role] ([Id])
);

