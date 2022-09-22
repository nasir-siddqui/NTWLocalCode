CREATE TABLE [dbo].[MPSDATA] (
    [ANumber]      CHAR (5)     NOT NULL,
    [BNumber]      VARCHAR (25) NOT NULL,
    [CNumber]      VARCHAR (25) NOT NULL,
    [CallDate]     DATETIME     NOT NULL,
    [CallDuration] INT          NOT NULL,
    [CallType]     INT          NOT NULL,
    [AreaId]       INT          NOT NULL,
    [AreaCode]     CHAR (5)     NOT NULL,
    [AnswerExtId]  INT          NULL,
    [AdvanceExtId] INT          NULL,
    [IntervalId]   SMALLINT     NULL
);

