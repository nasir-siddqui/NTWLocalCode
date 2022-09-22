CREATE TABLE [dbo].[Meddelandes] (
    [Id]   INT            IDENTITY (1, 1) NOT NULL,
    [Type] INT            NOT NULL,
    [From] DATETIME       NOT NULL,
    [To]   DATETIME       NOT NULL,
    [Text] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.Meddelandes] PRIMARY KEY CLUSTERED ([Id] ASC)
);

