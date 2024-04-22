## 📖 How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/JamesFTW/swoleapiv2.git

# Go into the repository
$ cd swoleapiv2

# Install dependencies
$ npm install

# Install Supabase via Homebrew
brew install supabase/tap/supabase

# Create .env.development and add the following
POSTGRES_PRISMA_URL='postgresql://postgres:postgres@127.0.0.1:54322/postgres'
POSTGRES_URL_NON_POOLING='postgresql://postgres:postgres@127.0.0.1:54322/postgres'
DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:54322/postgres'
SESSION_SECRET='<Generate Session Secret>'

# Run the app
$ npm run start:dev

Once the server is running, you can access API endpoints locally using tools like Postman or cURL.
```
