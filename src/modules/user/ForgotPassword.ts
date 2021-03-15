import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { SendMail } from "../utils/sendMail";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    // If there's no such a user, then return true
    // We don't want to mess around with someone who want to break our system
    if (!user) {
      return true
    }

    // Otherwise, we create a token for reset password and then store it in redis
    const token = v4();
    await redis.set(forgotPasswordPrefix+token, user.id, 'ex', 60*60*24); //Expire in 24 hours

    const url = `http://127.0.0.1:3000/user/forgot_password/${token}`;

    await SendMail(email, url);

    return true

  }

}