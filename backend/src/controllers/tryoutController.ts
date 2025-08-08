import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index.js';
import { tryoutPackages, questions } from '../db/schema/index.js';
import { eq, sql } from 'drizzle-orm';

export class TryoutController {
  static async getPackages(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get all active tryout packages with question count
      const packages = await db
        .select({
          id: tryoutPackages.id,
          title: tryoutPackages.title,
          description: tryoutPackages.description,
          duration: tryoutPackages.duration,
          totalQuestions: tryoutPackages.totalQuestions,
          difficulty: tryoutPackages.difficulty,
          price: tryoutPackages.price,
          isActive: tryoutPackages.isActive,
          createdAt: tryoutPackages.createdAt,
          questionCount: sql<number>`(
            SELECT COUNT(*) 
            FROM ${questions} 
            WHERE ${questions.tryoutPackageId} = ${tryoutPackages.id}
          )`.as('questionCount')
        })
        .from(tryoutPackages)
        .where(eq(tryoutPackages.isActive, true))
        .orderBy(tryoutPackages.createdAt);

      return reply.send({
        packages,
        total: packages.length
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  static async getPackageById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;

      const packageData = await db
        .select()
        .from(tryoutPackages)
        .where(eq(tryoutPackages.id, id))
        .limit(1);

      if (packageData.length === 0) {
        return reply.status(404).send({
          error: 'Tryout package not found'
        });
      }

      // Get questions for this package
      const packageQuestions = await db
        .select({
          id: questions.id,
          questionText: questions.questionText,
          subtest: questions.subtest,
          difficulty: questions.difficulty,
          createdAt: questions.createdAt
        })
        .from(questions)
        .where(eq(questions.tryoutPackageId, id))
        .orderBy(questions.orderIndex);

      return reply.send({
        package: {
          ...packageData[0],
          questions: packageQuestions
        }
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}