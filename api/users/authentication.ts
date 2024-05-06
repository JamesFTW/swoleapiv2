import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UsersServices } from './services/UserServices'

passport.use(
  new LocalStrategy(async (userName: string, password: string, cb: Function) => {
    const usersServices = new UsersServices()

    try {
      const user = await usersServices.getByUserName(userName)

      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' })
      }

      /**
       * @param1 plain-text password
       * @param2 encrypted password
       */
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return cb(null, false, { message: 'Incorrect username or password.' })
      }

      return cb(null, user)
    } catch (e) {
      console.log(e)
    }
  }),
)

passport.serializeUser((user: Express.User, cb: Function) => {
  process.nextTick(function () {
    cb(null, { userId: user.userId, userName: user.userName })
  })
})

passport.deserializeUser((user: Express.User, cb: Function) => {
  process.nextTick(function () {
    return cb(null, user)
  })
})

export default passport
