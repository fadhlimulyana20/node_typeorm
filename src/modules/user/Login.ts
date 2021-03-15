import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from 'bcryptjs';
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { AuthenticationError } from "apollo-server-errors";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async Login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if(!user) {
      return null
    }

    const valid = await bcrypt.compare(password, user.password);

    if(!valid) {
      throw new AuthenticationError('Invalid Password')
    }

    if(!user.confirmed) {
      throw new AuthenticationError('Email is not verified')
    }

    ctx.req.session.userId = user.id;

    return user;
  }

}