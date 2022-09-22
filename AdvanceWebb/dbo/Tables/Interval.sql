CREATE TABLE [dbo].[Interval] (
    [Interval]   INT          NOT NULL,
    [Text]       VARCHAR (10) NOT NULL,
    [IntervalId] SMALLINT     IDENTITY (1, 1) NOT NULL,
    CONSTRAINT [PK_Intervall] PRIMARY KEY CLUSTERED ([Interval] ASC) WITH (FILLFACTOR = 90)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_IntervalID]
    ON [dbo].[Interval]([IntervalId] ASC) WITH (FILLFACTOR = 90);

