CREATE TABLE [dbo].[SupportLog] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [UserId]      INT            NULL,
    [Area]        VARCHAR (50)   NULL,
    [Description] VARCHAR (300)  NULL,
    [cmdSQL]      VARCHAR (1000) NOT NULL,
    [EffectDate]  DATETIME       CONSTRAINT [DF_SupportLog_EffectDate] DEFAULT (getdate()) NOT NULL
) ON [ADMIN];

