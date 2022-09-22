CREATE TABLE [dbo].[SupportMail] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [CompanyId]   INT            NOT NULL,
    [FromName]    VARCHAR (30)   NOT NULL,
    [FromAddress] VARCHAR (500)  NOT NULL,
    [Subject]     VARCHAR (100)  NOT NULL,
    [BodyText]    VARCHAR (2000) NOT NULL,
    [Datum]       DATETIME       NOT NULL
) ON [ADMIN];

