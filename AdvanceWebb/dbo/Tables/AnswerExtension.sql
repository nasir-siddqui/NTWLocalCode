CREATE TABLE [dbo].[AnswerExtension] (
    [AnswerExtID]  INT          IDENTITY (2000000, 1) NOT NULL,
    [Number]       VARCHAR (20) NOT NULL,
    [AdvanceExtId] INT          NOT NULL,
    [CreationDate] DATETIME     CONSTRAINT [DF_AnswerExtension_new_CreationDate] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_AnswerExtension] PRIMARY KEY CLUSTERED ([AnswerExtID] ASC) WITH (FILLFACTOR = 90),
    CONSTRAINT [FK_AnswerExtension_AdvanceExtension] FOREIGN KEY ([AdvanceExtId]) REFERENCES [dbo].[AdvanceExtension] ([AdvanceExtID]) ON DELETE CASCADE
);



