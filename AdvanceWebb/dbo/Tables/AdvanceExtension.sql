CREATE TABLE [dbo].[AdvanceExtension] (
    [AdvanceExtID]    INT          IDENTITY (1100000, 1) NOT NULL,
    [Active]          CHAR (1)     CONSTRAINT [DF_AdvanceExtension_Active] DEFAULT (1) NOT NULL,
    [Number]          VARCHAR (20) NOT NULL,
    [IntervalLow]     INT          CONSTRAINT [DF_AdvanceExtension_IntervalLow] DEFAULT (60) NOT NULL,
    [IntervalHigh]    INT          CONSTRAINT [DF_AdvanceExtension_IntervalHigh] DEFAULT (300) NOT NULL,
    [Subscribed]      BIT          CONSTRAINT [DF_AdvanceExtension_Subscribed] DEFAULT (0) NOT NULL,
    [CompanyId]       INT          NULL,
    [CreationDate]    DATETIME     CONSTRAINT [DF_AdvanceExtension_CreationDate] DEFAULT (getdate()) NOT NULL,
    [ChangedDate]     DATETIME     NULL,
    [ChangedBy]       INT          NULL,
    [AnalysisView]    SMALLINT     CONSTRAINT [DF_AdvanceExtension_AnalysisView] DEFAULT (1) NOT NULL,
    [AnalysisRawdata] BIT          CONSTRAINT [DF_AdvanceExtension_AnalysisRawdata] DEFAULT (0) NOT NULL,
    CONSTRAINT [PK_AdvanceExtension] PRIMARY KEY CLUSTERED ([AdvanceExtID] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_AdvanceExtension_ChangedBy] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL,
    CONSTRAINT [FK_AdvanceExtension_CompanyInfo] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[CompanyInfo] ([CompanyId]) ON DELETE SET NULL
);








GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_ActiveAdvanceExt]
    ON [dbo].[AdvanceExtension]([Active] ASC, [Number] ASC, [AdvanceExtID] ASC) WITH (FILLFACTOR = 90)
    ON [PRIMARY];


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_AdvExtNumber]
    ON [dbo].[AdvanceExtension]([Number] ASC) WITH (FILLFACTOR = 90)
    ON [PRIMARY];

