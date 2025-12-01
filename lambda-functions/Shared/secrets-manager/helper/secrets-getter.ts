import secretsClient from "../config/client";
import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
let cache: Map<string, string> = new Map();

export const getSecret = async (secret_key: string): Promise<string> => {
  try {
    // get the secret from cache
    let secret = cache.get(secret_key);

    // if not present in cache then get it from source
    if (!secret) {
      let response = await secretsClient.send(
        new GetSecretValueCommand({
          SecretId: secret_key,
        })
      );
      // if secret is defined then store it in cache
      if (response.SecretString) {
        cache.set(secret_key, response.SecretString);
        return response.SecretString;
      }
      throw new Error(`${secret_key} not found`);
    }
    console.log(`cache hit for key :: ${secret_key}`);
    return secret;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
