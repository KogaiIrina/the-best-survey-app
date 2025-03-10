import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../../prisma/lib/prisma';

export async function GET (request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const surveyId = parseInt(id);

    const survey = await prisma.survey.findUnique({
      where: {
        id: surveyId,
      },
      include: {
        responses: {
          include: {
            question: true,
          }
        }
      }
    });

    if (!survey) {
      return NextResponse.json({error: 'Survey not found'}, {status: 404});
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json({error: 'Failed to fetch survey'}, {status: 500});
  }
}
