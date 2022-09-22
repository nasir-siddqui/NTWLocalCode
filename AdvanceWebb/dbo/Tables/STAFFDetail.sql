CREATE TABLE [dbo].[STAFFDetail] (
    [UserId]             INT           CONSTRAINT [DF_STAFFDetail_UserId] DEFAULT (0) NOT NULL,
    [localId]            INT           IDENTITY (1, 1) NOT NULL,
    [id]                 DECIMAL (18)  NOT NULL,
    [MultiConnectLinkId] DECIMAL (18)  NULL,
    [serviceid]          DECIMAL (18)  NULL,
    [connectLinkId]      DECIMAL (18)  NULL,
    [name]               VARCHAR (255) NULL,
    [status]             CHAR (1)      CONSTRAINT [DF_STAFFDetail_status] DEFAULT ('N') NOT NULL,
    CONSTRAINT [PK_STAFFDetail] PRIMARY KEY CLUSTERED ([localId] ASC) WITH (FILLFACTOR = 90)
);

