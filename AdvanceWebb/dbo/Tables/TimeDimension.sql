CREATE TABLE [dbo].[TimeDimension] (
    [dateTime] SMALLDATETIME NOT NULL,
    CONSTRAINT [PK_TimeDimension] PRIMARY KEY CLUSTERED ([dateTime] ASC) WITH (FILLFACTOR = 90)
);

