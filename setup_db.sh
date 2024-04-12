#!/bin/bash
npm run prisma:postinstall
npm run prisma:import 
npm run db:migrate
npm run db:seed 