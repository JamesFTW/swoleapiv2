#!/bin/bash

supabase init
supabase start
npm run db:push:dev
npm run db:seed:dev
supabase status
open 'http://127.0.0.1:54323'
npm run dev:server
