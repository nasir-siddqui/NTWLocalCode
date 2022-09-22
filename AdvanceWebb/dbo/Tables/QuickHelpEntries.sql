CREATE TABLE [dbo].[QuickHelpEntries] (
    [Id]      NVARCHAR (128) NOT NULL,
    [Content] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.QuickHelpEntries] PRIMARY KEY CLUSTERED ([Id] ASC)
);

