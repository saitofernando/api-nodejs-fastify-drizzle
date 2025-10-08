import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import z from 'zod';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  // ===== ROTA POST /courses =====
  server.post(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Create a course',
        description: 'massa vei',
        body: z.object({
          title: z.string().min(5, 'obrigatório 5 caracteres'),
          description: z.string().nullable(),
        }),
        response: {
          201: z.object({ courseId: z.uuid() }).describe('Curso criado com sucesso!'),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;
      const courseDescription = request.body.description;

      const result = await db.insert(courses).values({ title: courseTitle, description: courseDescription }).returning();

      return reply.status(201).send({ courseId: result[0].id });
    },
  );
};
