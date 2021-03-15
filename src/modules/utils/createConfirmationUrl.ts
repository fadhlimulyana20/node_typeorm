import { v4 } from "uuid"
import { redis } from "../../redis";
import { confirmUserPrefix } from "../constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number): Promise<string> => {
  const token = v4();
  await redis.set(confirmUserPrefix+token, userId, 'ex', 60*60*24); //Expire in 24 hours

  return `http://127.0.0.1:3000/user/confirmation/${token}`;
}