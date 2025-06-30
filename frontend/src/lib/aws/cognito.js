import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-southeast-2_YSMBWDLdX",       // e.g. ap-southeast-2_XXXX
  ClientId: "7rg9op8ldqhs30nd3k1bins1ia",        // e.g. 2abc3defghij456klmnop7qr
};

export const userPool = new CognitoUserPool(poolData);