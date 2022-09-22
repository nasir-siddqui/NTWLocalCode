CREATE TABLE [dbo].[UserSettings] (
    [NoOfRecords] SMALLINT    CONSTRAINT [DF_UserSettings_NoOfRecords] DEFAULT (20) NOT NULL,
    [Expmenu]     BIT         CONSTRAINT [DF_UserSettings_Expmenu] DEFAULT (0) NOT NULL,
    [Language]    VARCHAR (3) CONSTRAINT [DF_UserSettings_Language] DEFAULT ('Swe') NOT NULL,
    [LogonDate]   DATETIME    NULL,
    [UserId]      INT         NOT NULL,
    CONSTRAINT [PK_UserSettings] PRIMARY KEY CLUSTERED ([UserId] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_UserSettings_Webb_Users_Login] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE
);







