CREATE TABLE [dbo].[Users] (
    [UserID]            INT           IDENTITY (150, 1) NOT NULL,
    [CompanyId]         INT           NULL,
    [LoginName]         VARCHAR (50)  NOT NULL,
    [Name]              VARCHAR (50)  CONSTRAINT [DF_Webb_Users_Login_Namn] DEFAULT ('') NOT NULL,
    [Password]          VARCHAR (50)  CONSTRAINT [DF_Users_Password] DEFAULT ('NotInUse32!') NULL,
    [Note]              VARCHAR (255) CONSTRAINT [DF_Webb_Users_Login_Notering] DEFAULT ('') NULL,
    [Security]          VARCHAR (10)  CONSTRAINT [DF_Webb_Users_Login_Sak_Kod] DEFAULT ('0000000000') NULL,
    [CustNo]            VARCHAR (5)   NULL,
    [Parent]            BIT           CONSTRAINT [DF_Webb_Users_Login_Parent] DEFAULT (0) NOT NULL,
    [Email]             VARCHAR (50)  CONSTRAINT [DF_Webb_Users_Login_Email] DEFAULT ('') NOT NULL,
    [TelNo]             VARCHAR (30)  CONSTRAINT [DF_Webb_Users_Login_Telefon] DEFAULT ('') NOT NULL,
    [Eno]               CHAR (10)     NULL,
    [SalesUnitsAllowed] VARCHAR (20)  NULL,
    [ProdStod]          VARCHAR (50)  NULL,
    [CreationDate]      DATETIME      CONSTRAINT [DF_Webb_Users_Login_creationDate] DEFAULT (getdate()) NOT NULL,
    [ChangedDate]       DATETIME      NULL,
    [ChangedBy]         INT           NULL,
    [LogonDate]         DATETIME      NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY NONCLUSTERED ([UserID] ASC) WITH (FILLFACTOR = 90) ON [PRIMARY],
    CONSTRAINT [FK_User_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID])
) ON [ADMIN];


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_UsersLoginName]
    ON [dbo].[Users]([LoginName] ASC) WITH (FILLFACTOR = 90)
    ON [ADMIN];

