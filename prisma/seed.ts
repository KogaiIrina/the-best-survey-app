import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.response.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.question.deleteMany();

  await prisma.question.createMany({
    data: [{
      title: "What is your name?",
      description: "Please, provide your full name",
      inputType: "text",
      options: null,
    }, {
      title: "What is your age?",
      description: "Please, select your age range",
      inputType: "select",
      options: JSON.stringify([
        { label: "18-24", value: "18-24" },
        { label: "25-34", value: "25-34" },
        { label: "35-44", value: "35-44" },
        { label: "45-54", value: "45-54" },
        { label: "55-64", value: "55-64" },
      ]),
    },
    {
      title: "What is your gender?",
      description: "Please, select your gender",
      inputType: "select",
      options: JSON.stringify([
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ]),
    },
    {
      title: "Do you have any chronic conditions?",
      description: "Please, mention any chronic conditions you have",
      inputType: "text",
      options: null,
    },
    {
      title: "What is your annual household income?",
      description: "Please, select a range that best describes your household income",
      inputType: "select",
      options: JSON.stringify([
        { label: "Less than $20,000", value: "less than $20,000" },
        { label: "$20,000 - $40,000", value: "$20,000 - $40,000" },
        { label: "$40,000 - $60,000", value: "$40,000 - $60,000" },
        { label: "$60,000 - $80,000", value: "$60,000 - $80,000" },
        { label: "$80,000 - $100,000", value: "$80,000 - $100,000" },
        { label: "$100,000 or more", value: "$100,000 or more" },
      ]),
    },
    {
      title: "How would you rate your overall health?",
      description: "On a scale from poor to excellent",
      inputType: "select",
      options: JSON.stringify([
        { label: "Poor", value: "poor" },
        { label: "Fair", value: "fair" },
        { label: "Good", value: "good" },
        { label: "Very good", value: "very good" },
        { label: "Excellent", value: "excellent" },
      ]),
    },
  ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
