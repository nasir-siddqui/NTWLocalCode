CREATE TABLE [dbo].[ImportGeoCare] (
    [bNumber]                 VARCHAR (30)   NOT NULL,
    [cNumber]                 VARCHAR (30)   NULL,
    [Date]                    VARCHAR (10)   NOT NULL,
    [Time]                    VARCHAR (2)    NOT NULL,
    [Total]                   INT            NOT NULL,
    [percentCallsAnswered]    DECIMAL (5, 2) NOT NULL,
    [percentCallsBusy]        DECIMAL (5, 2) NOT NULL,
    [percentCallsNotAnswered] DECIMAL (5, 2) NOT NULL,
    [percentCallsCongestion]  DECIMAL (5, 2) NOT NULL,
    [AdvanceExtId]            INT            NULL,
    [AnswerExtId]             INT            NULL,
    [DateTime]                SMALLDATETIME  NULL
);

