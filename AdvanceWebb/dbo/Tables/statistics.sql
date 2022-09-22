CREATE TABLE [dbo].[statistics] (
    [type]  VARCHAR (50) NOT NULL,
    [Value] INT          NOT NULL,
    CONSTRAINT [PK_statistics] PRIMARY KEY NONCLUSTERED ([type] ASC) WITH (FILLFACTOR = 90)
);

