CREATE TABLE [dbo].[CallDataBackup] (
    [AnswerExtId]  INT           NOT NULL,
    [CallDateTime] DATETIME      NOT NULL,
    [AreaCode]     VARCHAR (10)  NOT NULL,
    [Extension]    VARCHAR (5)   NOT NULL,
    [CallDuration] INT           NOT NULL,
    [CallTypeID]   SMALLINT      NOT NULL,
    [CallDataID]   INT           IDENTITY (1, 1) NOT NULL,
    [AreaId]       SMALLINT      NOT NULL,
    [CallDate]     SMALLDATETIME NOT NULL,
    [IntervalId]   SMALLINT      NULL
);

