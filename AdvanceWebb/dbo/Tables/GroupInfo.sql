CREATE TABLE [dbo].[GroupInfo] (
    [GroupId]      INT          IDENTITY (1, 1) NOT NULL,
    [GroupCode]    VARCHAR (25) NULL,
    [GroupName]    VARCHAR (50) NOT NULL,
    [CreationDate] DATETIME     CONSTRAINT [DF_GroupInfo_TimeStamp] DEFAULT (getdate()) NOT NULL,
    [ChangedDate]  DATETIME     NULL,
    [ChangedBy]    INT          NULL,
    CONSTRAINT [PK_GroupInfo] PRIMARY KEY CLUSTERED ([GroupId] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_GroupInfo_ChangedBy] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL
);









