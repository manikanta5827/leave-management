export interface InputPayload {
  TaskToken: string;
  Payload: {
    apiUrl: string;
    email: string;
    noOfDays: number;
    username: string;
    reason: string;
  };
  Context: {
    Execution: {
      Id: string;
    };
  };
}
