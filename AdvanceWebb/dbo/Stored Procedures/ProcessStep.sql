CREATE PROCEDURE ProcessStep

@PID int,
@StepNo smallint,
@StepDescription varchar(50),
@Success bit,
@FailureDescription varchar(100)

AS

INSERT INTO ProcessSteps (PID, StepNo, StepDescription, Success, FailureDescription)
SELECT @PID, @StepNo, @StepDescription, @Success, @FailureDescription

IF @Success = 0
BEGIN

	UPDATE ProcessHeader
	SET EndDate = GetDate(), Note = 'Fel vid steg '+Convert(varchar(5),@StepNo)
	FROM ProcessHeader
	WHERE PID = @PID

END