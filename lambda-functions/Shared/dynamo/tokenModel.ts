import dynamoose from "./client";

const TokenSchema = new dynamoose.Schema({
  requestId: {
    type: String,
    hashKey: true,
  },
  token: String,
  userEmail: String,
  noOfDays: Number,
  username: String,
  reason: String,
  status: String,
  createdAt: String,
  updatedAt: String,
});

const TOKEN_TABLE = process.env.TOKEN_TABLE;

if (!TOKEN_TABLE) throw new Error("TOKEN_TABLE not passed in env");

const Token = dynamoose.model(TOKEN_TABLE, TokenSchema, { create: false });

export default Token;
