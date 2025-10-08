import fastify from 'fastify';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';

import { fastifySwagger } from '@fastify/swagger';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import { createCourseRoute } from './src/routes/create-course.ts';
import { getCourseByIdRoute } from './src/routes/get-courses-by-id.ts';

import scalarAPIReference from '@scalar/fastify-api-reference';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty', // deixa os logs mais legíveis no terminal
      options: {
        translateTime: 'HH:MM:ss Z', // mostra a hora formatada no log
        ignore: 'pid,hostname', // remove infos desnecessárias do log
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Desafio Node.js',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'moon',
    },
  });
}

server.setValidatorCompiler(validatorCompiler);

server.setSerializerCompiler(serializerCompiler);

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);

server.listen({ port: 3334 }).then(() => {
  console.log('HTTP server running!'); // mensagem de confirmação no console
});
