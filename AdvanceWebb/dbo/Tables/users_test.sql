CREATE TABLE [dbo].[users_test] (
    [UserID]            INT           IDENTITY (150, 1) NOT NULL,
    [CompanyId]         INT           NULL,
    [LoginName]         VARCHAR (50)  NOT NULL,
    [Name]              VARCHAR (50)  NOT NULL,
    [Password]          VARCHAR (50)  NOT NULL,
    [Note]              VARCHAR (255) NULL,
    [Security]          VARCHAR (10)  NOT NULL,
    [CustNo]            VARCHAR (5)   NULL,
    [Parent]            BIT           NOT NULL,
    [Email]             VARCHAR (50)  NOT NULL,
    [TelNo]             VARCHAR (30)  NOT NULL,
    [Eno]               CHAR (10)     NULL,
    [SalesUnitsAllowed] VARCHAR (20)  NULL,
    [ProdStod]          VARCHAR (50)  NULL,
    [CreationDate]      DATETIME      NOT NULL,
    [ChangedDate]       DATETIME      NULL,
    [ChangedBy]         INT           NULL
);

