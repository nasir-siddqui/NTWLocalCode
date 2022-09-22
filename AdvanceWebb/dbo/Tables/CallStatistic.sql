CREATE TABLE [dbo].[CallStatistic] (
    [AdvanceExtId]     INT            NOT NULL,
    [AnswereExtId]     INT            NULL,
    [CallDateTime]     SMALLDATETIME  NOT NULL,
    [TotalCalls]       INT            CONSTRAINT [DF_CallStatistic_TotalCalls] DEFAULT (0) NOT NULL,
    [AnsweredCalls]    INT            CONSTRAINT [DF_CallStatistic_AnsweredCalls] DEFAULT (0) NOT NULL,
    [BusyCalls]        NUMERIC (5, 2) CONSTRAINT [DF_CallStatistic_BusyCalls] DEFAULT (0) NOT NULL,
    [NotAnsweredCalls] NUMERIC (5, 2) CONSTRAINT [DF_CallStatistic_NotAnsweredCalls] DEFAULT (0) NOT NULL,
    [BlockedCalls]     NUMERIC (5, 2) CONSTRAINT [DF_CallStatistic_BlockedCalls] DEFAULT (0) NOT NULL,
    [CallStatisticID]  INT            IDENTITY (1, 1) NOT NULL,
    [CNumber]          VARCHAR (20)   NULL,
    CONSTRAINT [FK_CallStatistic_AdvanceExtension] FOREIGN KEY ([AdvanceExtId]) REFERENCES [dbo].[AdvanceExtension] ([AdvanceExtID]),
    CONSTRAINT [FK_CallStatistic_AnswerExtension] FOREIGN KEY ([AnswereExtId]) REFERENCES [dbo].[AnswerExtension] ([AnswerExtID])
);

