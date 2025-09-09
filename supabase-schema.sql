 ./app/api/providers/search/route.ts (2:1)

Module not found: Can't resolve '../../../lib/supabase'
  1 | import { NextRequest, NextResponse } from 'next/server'
> 2 | import { supabase } from '../../../lib/supabase'
    | ^
  3 |
  4 | export async function GET(request: NextRequest) {
  5 |   try {

https://nextjs.org/docs/messages/module-not-found