import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient({
  region: "ap-south-1",
});

export default secretsClient;
