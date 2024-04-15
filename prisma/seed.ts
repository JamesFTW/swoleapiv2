import { PrismaClient } from '@prisma/client'
import { chest, back, legs, shoulders } from './exerciseseeds'

const prisma = new PrismaClient()

async function main() {
  await prisma.$queryRaw`TRUNCATE TABLE "Exercises" RESTART IDENTITY CASCADE;`
  const exerciseSeeds = [chest, back, legs, shoulders]

  await prisma.$transaction(
    exerciseSeeds.flatMap((exercise) =>
      exercise.map((item) =>
        prisma.exercises.upsert({
          where: { exerciseName: item.exerciseName },
          create: item,
          update: {},
        })
      )
    )
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
