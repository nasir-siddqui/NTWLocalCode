CREATE TABLE [dbo].[STAFFlog] (
    [Id]          INT         IDENTITY (1, 1) NOT NULL,
    [UserId]      INT         NOT NULL,
    [Area]        CHAR (50)   NULL,
    [Description] CHAR (100)  NULL,
    [cmdSQL]      CHAR (1000) NULL,
    [effectDate]  DATETIME    CONSTRAINT [DF_STAFFlog_effectDate] DEFAULT (getdate()) NOT NULL
);

