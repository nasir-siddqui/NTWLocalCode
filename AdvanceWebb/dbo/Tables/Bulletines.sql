CREATE TABLE [dbo].[Bulletines] (
    [ID]           INT           IDENTITY (1, 1) NOT NULL,
    [Text]         VARCHAR (500) NOT NULL,
    [CreationDate] DATETIME      CONSTRAINT [DF_Bulletines_CreationDate] DEFAULT (getdate()) NOT NULL,
    [StartDate]    DATETIME      NOT NULL,
    [EndDate]      DATETIME      NULL,
    [Type]         CHAR (1)      CONSTRAINT [DF_Bulletines_Type] DEFAULT ('') NOT NULL,
    [AppId]        INT           NOT NULL,
    CONSTRAINT [PK_Bulletines] PRIMARY KEY NONCLUSTERED ([ID] ASC) WITH (FILLFACTOR = 90) ON [PRIMARY]
) ON [ADMIN];

