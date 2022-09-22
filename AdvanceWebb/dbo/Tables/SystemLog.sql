CREATE TABLE [dbo].[SystemLog] (
    [id]       INT           IDENTITY (1, 1) NOT NULL,
    [DateTime] DATETIME      CONSTRAINT [DF_Log_DateTime] DEFAULT (getdate()) NOT NULL,
    [UserName] VARCHAR (50)  NOT NULL,
    [Process]  VARCHAR (50)  NOT NULL,
    [Body]     VARCHAR (200) NULL,
    [Value]    INT           NULL
);


GO
CREATE CLUSTERED INDEX [IX_SystemLog]
    ON [dbo].[SystemLog]([DateTime] ASC) WITH (FILLFACTOR = 90)
    ON [ADMIN];

