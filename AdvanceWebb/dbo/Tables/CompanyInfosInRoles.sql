CREATE TABLE [dbo].[CompanyInfosInRoles] (
    [CompanyInfoId] INT NOT NULL,
    [RoleId]        INT NOT NULL,
    CONSTRAINT [PK_CompanyInfosInRoles] PRIMARY KEY CLUSTERED ([CompanyInfoId] ASC, [RoleId] ASC),
    CONSTRAINT [FK_CompanyInfosInRoles_CompanyInfo] FOREIGN KEY ([CompanyInfoId]) REFERENCES [dbo].[CompanyInfo] ([CompanyId]) ON DELETE CASCADE,
    CONSTRAINT [FK_CompanyInfosInRoles_Role] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role] ([Id])
);



