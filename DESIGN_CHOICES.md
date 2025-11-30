# Architectural Decisions and Future Improvements

This document outlines the key design choices made during the development of the serverless leave management system.

## 1. API Gateway Integration Pattern

### Problem
The initial architectural goal was to trigger the AWS Step Function workflow directly from an Amazon API Gateway endpoint. This approach is often favored for its simplicity. However, attempts to implement this using an HTTP API resulted in persistent and hard-to-diagnose `500` internal server errors. This indicated that the direct integration was not functioning as expected and was too unreliable for a production system.

### Solution
To create a more robust and debuggable entry point, the architecture was revised to use a Lambda function as an intermediary. The final, successful pattern is:
**REST API Gateway -> `StepFunctionTriggerLambda` -> AWS Step Function**

This `StepFunctionTriggerLambda` receives the incoming request from the API Gateway, validates it, and then reliably initiates the Step Function execution. This approach also provided a natural point to attach a custom Lambda authorizer (`AuthLambda`), securing the endpoint without adding complexity to the Step Function itself.

## 2. Decoupled Notification Service

### Problem
A core requirement is to notify an administrator via email when a leave request requires approval. The most direct implementation would be to use a Step Function task state to call Amazon SES (Simple Email Service) directly. This approach, however, would tightly couple the workflow to a specific service (SES). If, in the future, notifications needed to be sent via Slack, SMS, or another channel, it would require modifying the core state machine definition, violating the Open/Closed Principle and making the workflow brittle.

### Solution
To avoid tight coupling and ensure future extensibility, a dedicated Lambda function (`LeaveApprovalLambda`) was created to act as a generic "messaging service." The Step Function's only responsibility is to invoke this Lambda, passing it the necessary data. The Lambda function, in turn, contains the specific logic for sending the notification (currently, via SES). This abstracts the notification logic out of the workflow orchestration, promoting a clean separation of concerns. If new notification channels are needed, only the Lambda function's code needs to be updated; the Step Function state machine remains unchanged.

## 3. HTTP Method Selection for `/leave-approval` API

### Problem
When initially designing the `/leave-approval` API endpoint, the choice of HTTP method evolved through several considerations. Initially, a `GET` method seemed plausible due to the absence of a request body and the use of query parameters for data. However, the operation's nature, involving data submission to the backend, suggested `POST` was more appropriate. Further reflection revealed that the API was not merely creating new data but rather updating existing leave request statuses, leading to the consideration of `PUT`.

### Solution
The final decision was to use the `PATCH` HTTP method for the `/leave-approval` API. This choice was made because the operation involves updating only specific fields of an existing resource (a leave request, by changing its status), rather than replacing the entire resource. `PATCH` semantically represents a partial modification, which accurately describes the API's function. This evolution from `GET` to `POST`, then `PUT`, and finally `PATCH` reflects a careful consideration of RESTful principles and the precise nature of the data manipulation involved.

## Potential Future Improvements
- **Extend Notification Service:** Enhance `LeaveApprovalLambda` to support multiple notification channels (e.g., SMS, push notifications) based on user preferences.
- **Advanced Request Validation:** Implement more robust input validation within `StepFunctionTriggerLambda` to ensure data integrity before Step Function execution.