CREATE TABLE [dbo].[UserAdvanceNumbers] (
    [UserID]          INT      NOT NULL,
    [AdvanceExtId]    INT      NOT NULL,
    [AnalysisView]    SMALLINT CONSTRAINT [DF_UserAdvanceNumbers_AnalysisView] DEFAULT (1) NOT NULL,
    [AnalysisRawData] BIT      CONSTRAINT [DF_UserAdvanceNumbers_AnalysisRawData] DEFAULT (0) NOT NULL,
    [CreationDate]    DATETIME CONSTRAINT [DF_UserAdvanceNumbers_CreationDate] DEFAULT (getdate()) NOT NULL,
    [ChangedDate]     DATETIME NULL,
    [ChangedBy]       INT      NULL,
    CONSTRAINT [PK_UserAdvanceNumbers] PRIMARY KEY CLUSTERED ([UserID] ASC, [AdvanceExtId] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_UserAdvanceNumbers_AdvanceExtension] FOREIGN KEY ([AdvanceExtId]) REFERENCES [dbo].[AdvanceExtension] ([AdvanceExtID]),
    CONSTRAINT [FK_UserAdvanceNumbers_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK_UserAdvanceNumbers_Webb_Users_Login] FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE
);









