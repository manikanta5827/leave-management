# Serverless Leave Management System

This project is a **Serverless Leave Management System** built on AWS, designed to automate the process of submitting, approving, and notifying employees about leave requests.

## Features
- **Authenticated API Endpoints:** Secure access for submitting and responding to leave requests.
- **Workflow Orchestration:** Uses AWS Step Functions to manage the multi-step leave approval process.
- **Email Notifications:** Sends automated emails for approval requests to admins and status updates to employees.
- **Dynamic Approval Handling:** Allows administrators to approve or reject leave requests which then resumes the workflow.

## Flow

1.  **Employee Submits Leave Request:**
    *   An authenticated employee sends a `POST` request to `/leave-approval`.
    *   The `StepFunctionTriggerLambda` is invoked, which starts a new execution of the `MyStateMachine` (Leave Approval Step Function).

2.  **Admin Approval Request:**
    *   The Step Function executes the `LeaveApproval` state, invoking the `LeaveApprovalLambda`.
    *   The `LeaveApprovalLambda` sends an email to the designated administrator asking for approval. It also stores a unique `requestId` (task token) in a DynamoDB table (`TokenTable`) and then *pauses* the Step Function, waiting for the admin's response.

3.  **Admin Responds:**
    *   The administrator reviews the leave request and provides a decision (approve/reject), typically via a link in the email.
    *   This action triggers an unauthenticated `POST` request to `/leave-response`.
    *   The `StepFunctionResumeLambda` is invoked, which retrieves the stored task token from DynamoDB and signals the waiting Step Function to continue, indicating whether the request was approved or rejected.

4.  **Notify Employee:**
    *   **If Approved:** The Step Function proceeds to the `SuccessLeaveApprovalHandler` state, which invokes the `SuccessLeaveApprovalLambda` to send an approval notification email to the employee.
    *   **If Rejected:** The Step Function proceeds to the `FailureLeaveApprovalHandler` state, which invokes the `FailureLeaveApprovalLambda` to send a rejection notification email to the employee.
    *   The Step Function execution then ends.

## Setup
```bash
npm install
npm run build
npm run deploy
npm test
```