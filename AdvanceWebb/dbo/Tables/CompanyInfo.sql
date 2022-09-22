CREATE TABLE [dbo].[CompanyInfo] (
    [CompanyId]         INT           IDENTITY (1, 1) NOT NULL,
    [OrgNr]             VARCHAR (25)  NOT NULL,
    [CompanyName]       VARCHAR (70)  NOT NULL,
    [GroupId]           INT           CONSTRAINT [DF_Webb_Users_Org_KoncernID] DEFAULT (' ') NULL,
    [EDI]               VARCHAR (15)  NULL,
    [Country]           VARCHAR (50)  NULL,
    [SamRefKod]         VARCHAR (10)  CONSTRAINT [DF_Webb_Users_Org_SamRefKod] DEFAULT ('') NULL,
    [UnitNo]            VARCHAR (4)   NULL,
    [OLD ContactName]   VARCHAR (50)  NULL,
    [OLD ContactTelNo]  VARCHAR (30)  NULL,
    [OLD ContactEmail]  VARCHAR (100) NULL,
    [OLD ContactUserId] INT           NULL,
    [Date]              VARCHAR (12)  CONSTRAINT [DF_Webb_Users_Org_Datum] DEFAULT (getdate()) NULL,
    [CustNo]            VARCHAR (5)   NULL,
    [ActiveVIP]         BIT           CONSTRAINT [DF_Webb_Users_Org_Aktivt] DEFAULT (0) NULL,
    [ActiveStat]        BIT           CONSTRAINT [DF_Webb_Users_Org_AktivtStat] DEFAULT (0) NULL,
    [ActiveCpa]         BIT           NULL,
    [New]               BIT           CONSTRAINT [DF_Webb_Users_Org_Ny] DEFAULT (0) NULL,
    [PhoneKey]          VARCHAR (200) NULL,
    [ExtendedMulti]     BIT           CONSTRAINT [DF_CompanyInfo_ExtendedMulti] DEFAULT (0) NULL,
    [CreationDate]      DATETIME      CONSTRAINT [DF_CompanyInfo_CreationDate] DEFAULT (getdate()) NOT NULL,
    [ChangedDate]       DATETIME      NULL,
    [ChangedBy]         INT           NULL,
    [SystemChangedDate] DATETIME      NULL,
    [UserIdA]           INT           NULL,
    [UserIdD]           INT           NULL,
    [UserIdCpa]         INT           CONSTRAINT [DF_CompanyInfo_UserIdCpa] DEFAULT (0) NULL,
    CONSTRAINT [PK_CompanyInfo] PRIMARY KEY CLUSTERED ([CompanyId] ASC) WITH (FILLFACTOR = 90) ON [ADMIN],
    CONSTRAINT [FK_CompanyInfo_ChangedByUser] FOREIGN KEY ([ChangedBy]) REFERENCES [dbo].[Users] ([UserID]) ON DELETE SET NULL,
    CONSTRAINT [FK_CompanyInfo_ContactAnalys] FOREIGN KEY ([UserIdA]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK_CompanyInfo_ContactLeverantörsinformation] FOREIGN KEY ([UserIdCpa]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK_CompanyInfo_ContactWebstyrning] FOREIGN KEY ([UserIdD]) REFERENCES [dbo].[Users] ([UserID]),
    CONSTRAINT [FK_Webb_Users_Org_Webb_Users_Koncern] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[GroupInfo] ([GroupId]) ON DELETE SET NULL
);












GO
CREATE NONCLUSTERED INDEX [IDX_GroupId]
    ON [dbo].[CompanyInfo]([GroupId] ASC) WITH (FILLFACTOR = 90)
    ON [PRIMARY];

