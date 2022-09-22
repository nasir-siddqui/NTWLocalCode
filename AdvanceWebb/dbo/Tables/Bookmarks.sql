CREATE TABLE [dbo].[Bookmarks] (
    [BookmarksID]   INT            IDENTITY (15000, 1) NOT NULL,
    [Header]        VARCHAR (20)   NOT NULL,
    [Description]   VARCHAR (100)  NULL,
    [NavBarKeys]    VARCHAR (2000) NULL,
    [NavBarValues]  VARCHAR (2000) NULL,
    [SessionKeys]   VARCHAR (2000) NULL,
    [SessionValues] VARCHAR (2000) NULL,
    [SessionTypes]  VARCHAR (2000) NULL,
    [PageURL]       VARCHAR (800)  NULL,
    [UserId]        INT            NOT NULL,
    [CreateDate]    SMALLDATETIME  CONSTRAINT [DF_Bookmarks_CreateDate] DEFAULT (getdate()) NOT NULL,
    [CompanyID]     INT            NULL,
    CONSTRAINT [PK_Bookmarks] PRIMARY KEY CLUSTERED ([BookmarksID] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_Bookmarks_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE CASCADE
);







