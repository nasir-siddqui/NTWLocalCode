CREATE TABLE [dbo].[QuickHelps] (
    [Controller] NVARCHAR (128) NOT NULL,
    [Action]     NVARCHAR (128) NOT NULL,
    [HTML]       NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.QuickHelps] PRIMARY KEY CLUSTERED ([Controller] ASC, [Action] ASC)
);

