import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import z from 'zod';

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  // ===== ROTA GET /courses =====
  server.get(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Get All courses',
        description: 'massa vei',
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select({ id: courses.id, title: courses.title, description: courses.description }).from(courses);

      return reply.send({ courses: result }); // responde com o array completo de cursos
    },
  );
};
