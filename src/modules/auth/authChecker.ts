import { AuthChecker } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const authChecker: AuthChecker<MyContext> = (
  { context: { req } },
) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  return !!req.session.userId;
};