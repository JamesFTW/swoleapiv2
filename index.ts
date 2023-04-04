import { PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient()
const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get('/about', async function (req: Request, res: Response) {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
        profile: true,
      },
    })
    res.json(allUsers)
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      error: e
    })
  }
})

// async function main() {
//     await prisma.user.create({
//       data: {
//         name: 'Alice',
//         email: 'alice@prisma.io',
//         posts: {
//           create: { title: 'Hello World' },
//         },
//         profile: {
//           create: { bio: 'I like turtles' },
//         },
//       },
//     })
  
//     const allUsers = await prisma.user.findMany({
//       include: {
//         posts: true,
//         profile: true,
//       },
//     })
//     console.dir(allUsers, { depth: null })
//   }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })


module.exports = app
