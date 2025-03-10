import { NextResponse } from "next/server";
import prisma from '../../../../prisma/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
