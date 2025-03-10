import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma/lib/prisma';

export async function GET (request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');

    if (!userIdParam) {
      return NextResponse.json({error: 'User ID is required'}, {status: 400});
    }

    const userId = parseInt(userIdParam);

    const surveys = await prisma.survey.findFirst({
      where: {
        userId: userId,
      },
      include: {
        responses: {
          include: {
            question: true,
          }
        }
      }
    })

    return NextResponse.json(surveys, {status: 200});
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json({error: 'Failed to fetch surveys'}, {status: 500});  
  }
}

export async function POST (request: NextRequest) {

  try {
    const body = await request.json();
    const survey = await prisma.survey.create({
      data: {
        userId: body.userId,
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
