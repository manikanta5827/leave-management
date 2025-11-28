export interface InputPayload {
  TaskToken: string;
  Payload: {
    apiUrl: string;
    email: string;
    noOfDays: number;
    userName: string;
    reason: string;
  };
  Context: {
    Execution: {
      Id: string;
    };
  };
}
