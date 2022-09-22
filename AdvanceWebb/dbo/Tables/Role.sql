CREATE TABLE [dbo].[Role] (
    [Id]              INT            NOT NULL,
    [Name]            VARCHAR (256)  NOT NULL,
    [Description]     NVARCHAR (256) NULL,
    [ApplicationRole] BIT            NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([Id] ASC)
);











