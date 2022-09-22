CREATE TABLE [dbo].[ServiceLog] (
    [Id]                INT           IDENTITY (1, 1) NOT NULL,
    [Component]         VARCHAR (50)  NULL,
    [InternalFunction]  VARCHAR (50)  NULL,
    [ErrNo]             VARCHAR (200) NULL,
    [ErrNoHex]          VARCHAR (200) NULL,
    [Description]       TEXT          NULL,
    [DetailDescription] TEXT          NULL,
    [Severity]          SMALLINT      NULL,
    [TimeStamp]         DATETIME      CONSTRAINT [DF_ServiceLog_TimeStamp] DEFAULT (getdate()) NOT NULL
);

