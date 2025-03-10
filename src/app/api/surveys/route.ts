import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/lib/prisma';

export async function POST (request: NextRequest) {

  try {
    const body = await request.json();
    const survey = await prisma.survey.create({
      data: {
        responses: {
          create: body.responses.map((response: {questionId: number, answer: string}) => ({
            questionId: response.questionId,
            answer: response.answer,
          })),
        },
      },
      include: {
        responses: true,
      }
    });

    return NextResponse.json(survey, {status: 201});
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json({error: 'Failed to create survey'}, {status: 500});
  }
}
