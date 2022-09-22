CREATE TABLE [dbo].[CallData] (
    [AnswerExtId]  INT           NOT NULL,
    [CallDateTime] DATETIME      NOT NULL,
    [AreaCode]     VARCHAR (10)  NOT NULL,
    [Extension]    VARCHAR (5)   NOT NULL,
    [CallDuration] INT           NOT NULL,
    [CallTypeID]   SMALLINT      NOT NULL,
    [CallDataID]   INT           IDENTITY (1, 1) NOT NULL,
    [AreaId]       SMALLINT      NOT NULL,
    [CallDate]     SMALLDATETIME NOT NULL,
    [IntervalId]   SMALLINT      NULL,
    CONSTRAINT [FK_CallData_AnswerExtension] FOREIGN KEY ([AnswerExtId]) REFERENCES [dbo].[AnswerExtension] ([AnswerExtID]),
    CONSTRAINT [FK_CallData_CallType] FOREIGN KEY ([CallTypeID]) REFERENCES [dbo].[CallType] ([ID]),
    CONSTRAINT [FK_CallData_Interval] FOREIGN KEY ([IntervalId]) REFERENCES [dbo].[Interval] ([IntervalId]),
    CONSTRAINT [FK_CallData_TimeDimension] FOREIGN KEY ([CallDate]) REFERENCES [dbo].[TimeDimension] ([dateTime])
);


GO
CREATE NONCLUSTERED INDEX [IX_CallData]
    ON [dbo].[CallData]([AnswerExtId] ASC, [CallDateTime] ASC) WITH (FILLFACTOR = 90);


GO
CREATE NONCLUSTERED INDEX [IX_CallData_1]
    ON [dbo].[CallData]([AreaCode] ASC, [Extension] ASC) WITH (FILLFACTOR = 90);

