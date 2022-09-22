CREATE TABLE [dbo].[ServiceLogNet] (
    [Id]               INT          NOT NULL,
    [Component]        VARCHAR (50) NULL,
    [InternalFunction] VARCHAR (50) NULL,
    [InnerException]   TEXT         NULL,
    [Message]          TEXT         NULL,
    [Source]           TEXT         NULL,
    [StackTrace]       TEXT         NULL,
    [TargetSite]       TEXT         NULL,
    [Severity]         SMALLINT     NULL,
    [TimeStamp]        DATETIME     NULL
);

