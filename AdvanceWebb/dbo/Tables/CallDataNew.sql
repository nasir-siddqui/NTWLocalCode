CREATE TABLE [dbo].[CallDataNew] (
    [AnswerExtId]      INT           NULL,
    [CallDateTime]     DATETIME      NOT NULL,
    [AreaCode]         VARCHAR (10)  NOT NULL,
    [Extension]        VARCHAR (5)   NOT NULL,
    [CallDuration]     INT           NOT NULL,
    [CallTypeID]       SMALLINT      NOT NULL,
    [AreaId]           SMALLINT      NOT NULL,
    [CallDate]         SMALLDATETIME NOT NULL,
    [IntervalId]       SMALLINT      NOT NULL,
    [AdvanceExtension] VARCHAR (30)  NOT NULL,
    [AnswerExtension]  VARCHAR (30)  NOT NULL,
    [AdvanceExtId]     INT           NULL
);

