import bcrypt from 'bcrypt';
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Users } from './models';

declare global {
  namespace Express {
    interface User {
      id: string,
      username: string
    }
  }
}

passport.use(new LocalStrategy(async (username: string, password: string, cb: Function) => {
  const users = new Users();

  try {
    const user = await users.getByUserName(username)

    if (!user) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    /**
     * @param1 plain-text password
     * @param2 encrypted password
     */
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    return cb(null, user);

 
  } catch (e) {
    console.log(e)
  }
}))

passport.serializeUser((user, cb) => {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user: Express.User, cb) => {
  process.nextTick(function() {
    return cb(null, user);
  });
});

export default passport