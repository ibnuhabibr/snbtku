import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { tryoutPackages, questions, tryoutSessions, userAnswers } from '../db/schema/index';
import { eq, sql, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class TryoutController {
  static async getPackages(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get all active tryout packages
      const packages = await db
        .select({
          id: tryoutPackages.id,
          title: tryoutPackages.title,
          description: tryoutPackages.description,
          duration_minutes: tryoutPackages.duration_minutes,
          total_questions: tryoutPackages.total_questions,
          difficulty_level: tryoutPackages.difficulty_level,
          price: tryoutPackages.price,
          is_active: tryoutPackages.is_active,
          created_at: tryoutPackages.created_at
        })
        .from(tryoutPackages)
        .where(eq(tryoutPackages.is_active, true))
        .orderBy(tryoutPackages.created_at);

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

      return reply.send({
        package: packageData[0]
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  // Start new tryout session
  static async startSession(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { packageId } = request.body as { packageId: string };
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: 'User not authenticated' });
      }

      // Get package details
      const packageData = await db
        .select()
        .from(tryoutPackages)
        .where(eq(tryoutPackages.id, packageId))
        .limit(1);

      if (packageData.length === 0) {
        return reply.status(404).send({ error: 'Tryout package not found' });
      }

      const tryoutPackage = packageData[0];

      // Get questions for this package based on subject distribution
      const selectedQuestions = await TryoutController.selectQuestionsForTryout(
        tryoutPackage.subject_distribution as any,
        tryoutPackage.difficulty_level
      );

      if (selectedQuestions.length === 0) {
        return reply.status(400).send({ error: 'No questions available for this package' });
      }

      // Create new session
      const sessionId = uuidv4();
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + tryoutPackage.duration_minutes * 60 * 1000);

      const newSession = await db
        .insert(tryoutSessions)
        .values({
          id: sessionId,
          user_id: userId,
          package_id: packageId,
          start_time: startTime,
          end_time: endTime,
          status: 'in_progress',
          current_question_index: 0,
          selected_questions: selectedQuestions.map(q => q.id)
        })
        .returning();

      // Return session data with first question
      return reply.status(201).send({
        sessionId: sessionId,
        packageId: packageId,
        startTime: startTime.toISOString(),
        duration: tryoutPackage.duration_minutes,
        totalQuestions: selectedQuestions.length,
        currentQuestionIndex: 0,
        questions: selectedQuestions.map(q => ({
          id: q.id,
          question_text: q.question_text,
          question_image_url: q.question_image_url,
          subject: q.subject,
          question_type: q.question_type,
          options: q.options
        }))
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to start session' });
    }
  }

  // Get current session status
  static async getSession(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const userId = request.user?.userId;

      const session = await db
        .select()
        .from(tryoutSessions)
        .where(and(
          eq(tryoutSessions.id, sessionId),
          eq(tryoutSessions.user_id, userId!)
        ))
        .limit(1);

      if (session.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      const sessionData = session[0];
      
      // Get questions for this session
      const sessionQuestions = await db
        .select()
        .from(questions)
        .where(inArray(questions.id, sessionData.selected_questions as string[]));

      // Get user answers for this session
      const answers = await db
        .select()
        .from(userAnswers)
        .where(eq(userAnswers.session_id, sessionId));

      return reply.send({
        session: sessionData,
        questions: sessionQuestions,
        answers: answers
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to get session' });
    }
  }

  // Submit answer
  static async submitAnswer(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const { questionId, answer, timeSpent } = request.body as {
        questionId: string;
        answer: string;
        timeSpent?: number;
      };
      const userId = request.user?.userId;

      // Verify session belongs to user
      const session = await db
        .select()
        .from(tryoutSessions)
        .where(and(
          eq(tryoutSessions.id, sessionId),
          eq(tryoutSessions.user_id, userId!)
        ))
        .limit(1);

      if (session.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      // Get question details
      const question = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .limit(1);

      if (question.length === 0) {
        return reply.status(404).send({ error: 'Question not found' });
      }

      const isCorrect = question[0].correct_answer === answer;

      // Save or update user answer
      const existingAnswer = await db
        .select()
        .from(userAnswers)
        .where(and(
          eq(userAnswers.session_id, sessionId),
          eq(userAnswers.question_id, questionId)
        ))
        .limit(1);

      if (existingAnswer.length > 0) {
        // Update existing answer
        await db
          .update(userAnswers)
          .set({
            selected_answer: answer,
            is_correct: isCorrect,
            time_spent: timeSpent || 0,
            updated_at: new Date()
          })
          .where(eq(userAnswers.id, existingAnswer[0].id));
      } else {
        // Create new answer
        await db
          .insert(userAnswers)
          .values({
            session_id: sessionId,
            question_id: questionId,
            selected_answer: answer,
            is_correct: isCorrect,
            time_spent: timeSpent || 0
          });
      }

      return reply.send({
        success: true,
        isCorrect: isCorrect
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to submit answer' });
    }
  }

  // Navigate to question
  static async navigateToQuestion(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const { questionIndex } = request.body as { questionIndex: number };
      const userId = request.user?.userId;

      // Update session current question index
      const updatedSession = await db
        .update(tryoutSessions)
        .set({
          current_question_index: questionIndex,
          updated_at: new Date()
        })
        .where(and(
          eq(tryoutSessions.id, sessionId),
          eq(tryoutSessions.user_id, userId!)
        ))
        .returning();

      if (updatedSession.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      return reply.send({
        success: true,
        currentQuestionIndex: questionIndex
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to navigate' });
    }
  }

  // Finish session
  static async finishSession(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const userId = request.user?.userId;

      // Get session data
      const session = await db
        .select()
        .from(tryoutSessions)
        .where(and(
          eq(tryoutSessions.id, sessionId),
          eq(tryoutSessions.user_id, userId!)
        ))
        .limit(1);

      if (session.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      // Calculate results
      const results = await TryoutController.calculateSessionResults(sessionId);

      // Update session status
      await db
        .update(tryoutSessions)
        .set({
          status: 'completed',
          completed_at: new Date(),
          total_score: results.totalScore,
          correct_answers: results.correctAnswers,
          subject_scores: results.subjectScores
        })
        .where(eq(tryoutSessions.id, sessionId));

      return reply.send({
        sessionId: sessionId,
        ...results,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to finish session' });
    }
  }

  // Get user history
  static async getUserHistory(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };
      const userId = request.user?.userId;
      const offset = (page - 1) * limit;

      const history = await db
        .select({
          id: tryoutSessions.id,
          package_title: tryoutPackages.title,
          start_time: tryoutSessions.start_time,
          completed_at: tryoutSessions.completed_at,
          status: tryoutSessions.status,
          total_score: tryoutSessions.total_score,
          correct_answers: tryoutSessions.correct_answers
        })
        .from(tryoutSessions)
        .leftJoin(tryoutPackages, eq(tryoutSessions.package_id, tryoutPackages.id))
        .where(eq(tryoutSessions.user_id, userId!))
        .orderBy(sql`${tryoutSessions.start_time} DESC`)
        .limit(limit)
        .offset(offset);

      return reply.send({
        history,
        page,
        limit
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to get history' });
    }
  }

  // Get session results
  static async getSessionResults(request: AuthenticatedRequest, reply: FastifyReply) {
    try {
      const { sessionId } = request.params as { sessionId: string };
      const userId = request.user?.userId;

      const session = await db
        .select()
        .from(tryoutSessions)
        .where(and(
          eq(tryoutSessions.id, sessionId),
          eq(tryoutSessions.user_id, userId!)
        ))
        .limit(1);

      if (session.length === 0) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      // Get detailed answers
      const answers = await db
        .select({
          question_id: userAnswers.question_id,
          selected_answer: userAnswers.selected_answer,
          is_correct: userAnswers.is_correct,
          time_spent: userAnswers.time_spent,
          question_text: questions.question_text,
          correct_answer: questions.correct_answer,
          subject: questions.subject,
          explanation: questions.explanation
        })
        .from(userAnswers)
        .leftJoin(questions, eq(userAnswers.question_id, questions.id))
        .where(eq(userAnswers.session_id, sessionId));

      return reply.send({
        session: session[0],
        answers: answers
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to get results' });
    }
  }

  // Helper method to select questions for tryout
  private static async selectQuestionsForTryout(
    subjectDistribution: Record<string, number>,
    difficultyLevel: string
  ) {
    const selectedQuestions = [];

    for (const [subject, count] of Object.entries(subjectDistribution)) {
      if (count > 0) {
        const subjectQuestions = await db
          .select()
          .from(questions)
          .where(and(
            eq(questions.subject, subject),
            eq(questions.difficulty_level, difficultyLevel),
            eq(questions.is_active, true),
            eq(questions.review_status, 'approved')
          ))
          .orderBy(sql`RANDOM()`)
          .limit(count);

        selectedQuestions.push(...subjectQuestions);
      }
    }

    return selectedQuestions;
  }

  // Helper method to calculate session results
  private static async calculateSessionResults(sessionId: string) {
    const answers = await db
      .select({
        is_correct: userAnswers.is_correct,
        time_spent: userAnswers.time_spent,
        subject: questions.subject
      })
      .from(userAnswers)
      .leftJoin(questions, eq(userAnswers.question_id, questions.id))
      .where(eq(userAnswers.session_id, sessionId));

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.is_correct).length;
    const totalScore = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = answers.reduce((sum, a) => sum + (a.time_spent || 0), 0);

    // Calculate subject scores
    const subjectScores: Record<string, any> = {};
    const subjectGroups = answers.reduce((groups, answer) => {
      const subject = answer.subject || 'unknown';
      if (!groups[subject]) groups[subject] = [];
      groups[subject].push(answer);
      return groups;
    }, {} as Record<string, any[]>);

    for (const [subject, subjectAnswers] of Object.entries(subjectGroups)) {
      const correct = subjectAnswers.filter(a => a.is_correct).length;
      const total = subjectAnswers.length;
      subjectScores[subject] = {
        correct,
        total,
        percentage: Math.round((correct / total) * 100)
      };
    }

    return {
      totalScore,
      correctAnswers,
      totalQuestions,
      timeSpent,
      subjectScores,
      percentile: 0 // TODO: Calculate based on other users' performance
    };
  }
}