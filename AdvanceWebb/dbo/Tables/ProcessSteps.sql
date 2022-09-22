CREATE TABLE [dbo].[ProcessSteps] (
    [PID]                INT           NOT NULL,
    [StepNo]             INT           NOT NULL,
    [StepDescription]    VARCHAR (50)  NULL,
    [Success]            BIT           CONSTRAINT [DF_ProcessSteps_Success] DEFAULT (0) NOT NULL,
    [FailureDescription] VARCHAR (100) NULL,
    [StepDate]           DATETIME      CONSTRAINT [DF_ProcessSteps_StepDate] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_ProcessSteps] PRIMARY KEY CLUSTERED ([PID] ASC, [StepNo] ASC) WITH (FILLFACTOR = 90),
    CONSTRAINT [FK_ProcessSteps_ProcessHeader] FOREIGN KEY ([PID]) REFERENCES [dbo].[ProcessHeader] ([PID]) NOT FOR REPLICATION
);

