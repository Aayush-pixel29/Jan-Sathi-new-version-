import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const classifyModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        department: {
          type: SchemaType.STRING,
          format: 'enum',
          enum: [
            'Pension & Pensioners Welfare',
            'Food & Public Distribution (PDS/Ration)',
            'Municipal & Urban Services',
            'Revenue & Certificates',
          ],
        },
        category: { type: SchemaType.STRING },
        sub_category: { type: SchemaType.STRING },
        priority: {
          type: SchemaType.STRING,
          format: 'enum',
          enum: ['High', 'Medium', 'Low'],
        },
        extracted_fields: {
          type: SchemaType.OBJECT,
          properties: {
            what: { type: SchemaType.STRING },
            where: { type: SchemaType.STRING },
            when: { type: SchemaType.STRING },
            references: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: ['what', 'where', 'when', 'references'],
        },
        structured_draft: { type: SchemaType.STRING },
      },
      required: [
        'department',
        'category',
        'sub_category',
        'priority',
        'extracted_fields',
        'structured_draft',
      ],
    },
  },
});

export const statusModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        explanation: { type: SchemaType.STRING },
        next_steps: { type: SchemaType.STRING },
        estimated_wait: { type: SchemaType.STRING },
      },
      required: ['explanation', 'next_steps', 'estimated_wait'],
    },
  },
});

export const escalationModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        escalation_letter: { type: SchemaType.STRING },
        addressed_to: { type: SchemaType.STRING },
      },
      required: ['escalation_letter', 'addressed_to'],
    },
  },
});
