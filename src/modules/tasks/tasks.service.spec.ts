import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/libs/database/prisma.service';
import { TasksService } from './tasks.service';

jest.mock('@google/genai', () => {
  const generateContent = jest.fn();

  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent,
      },
    })),
  };
});

describe('TasksService', () => {
  let service: TasksService;

  const mockPrisma = {
    task: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    taskTag: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockUser = {
    userId: 'user-1',
    email: 'test@example.com',
  };

  const expiredAt = new Date('2026-04-10T00:00:00.000Z');
  const createdAt = new Date('2026-04-01T00:00:00.000Z');
  const updatedAt = new Date('2026-04-02T00:00:00.000Z');

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create task and task tags, then return id', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Description 1',
        expiredAt,
        tagIds: ['tag-1', 'tag-2'],
      };

      mockPrisma.task.create.mockResolvedValue({
        id: 'task-1',
        title: dto.title,
        description: dto.description,
        expiredAt: dto.expiredAt,
        status: TaskStatus.PENDING,
        creatorId: mockUser.userId,
      });

      mockPrisma.taskTag.createMany.mockResolvedValue({ count: 2 });

      const result = await service.create(dto as any, mockUser as any);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Task 1',
          description: 'Description 1',
          expiredAt,
          status: TaskStatus.PENDING,
          creatorId: 'user-1',
        },
      });

      expect(mockPrisma.taskTag.createMany).toHaveBeenCalledWith({
        data: [
          { taskId: 'task-1', tagId: 'tag-1' },
          { taskId: 'task-1', tagId: 'tag-2' },
        ],
      });

      expect(result).toEqual({
        id: 'task-1',
      });
    });

    it('should create task without creating task tags when tagIds is empty', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Description 1',
        expiredAt,
        tagIds: [],
      };

      mockPrisma.task.create.mockResolvedValue({
        id: 'task-1',
        title: dto.title,
        description: dto.description,
        expiredAt: dto.expiredAt,
        status: TaskStatus.PENDING,
        creatorId: mockUser.userId,
      });

      const result = await service.create(dto as any, mockUser as any);

      expect(mockPrisma.task.create).toHaveBeenCalled();
      expect(mockPrisma.taskTag.createMany).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 'task-1' });
    });

    it('should create task without creating task tags when tagIds is undefined', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Description 1',
        expiredAt,
      };

      mockPrisma.task.create.mockResolvedValue({
        id: 'task-1',
        title: dto.title,
        description: dto.description,
        expiredAt: dto.expiredAt,
        status: TaskStatus.PENDING,
        creatorId: mockUser.userId,
      });

      const result = await service.create(dto as any, mockUser as any);

      expect(mockPrisma.task.create).toHaveBeenCalled();
      expect(mockPrisma.taskTag.createMany).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 'task-1' });
    });
  });

  describe('createMany', () => {
    it('should create many tasks with default status and creatorId', async () => {
      const dto = [
        {
          title: 'Task 1',
          description: 'Description 1',
          expiredAt,
        },
        {
          title: 'Task 2',
          description: 'Description 2',
          expiredAt,
        },
      ];

      mockPrisma.task.createMany.mockResolvedValue({ count: 2 });

      await service.createMany(dto as any, mockUser as any);

      expect(mockPrisma.task.createMany).toHaveBeenCalledWith({
        data: [
          {
            title: 'Task 1',
            description: 'Description 1',
            expiredAt,
            creatorId: 'user-1',
            status: TaskStatus.PENDING,
          },
          {
            title: 'Task 2',
            description: 'Description 2',
            expiredAt,
            creatorId: 'user-1',
            status: TaskStatus.PENDING,
          },
        ],
      });
    });
  });

  describe('getList', () => {
    it('should return paginated tasks without filters', async () => {
      mockPrisma.task.findMany.mockResolvedValue([
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          creatorId: 'user-1',
          expiredAt,
          createdAt,
          updatedAt,
          deletedAt: null,
          taskTags: [
            {
              id: 'task-tag-1',
              taskId: 'task-1',
              tagId: 'tag-1',
              tag: {
                id: 'tag-1',
                title: 'Tag 1',
                description: 'Description tag 1',
                createdAt,
                updatedAt,
              },
            },
          ],
        },
      ]);

      mockPrisma.task.count.mockResolvedValue(1);

      const result = await service.getList(
        {
          page: 1,
          limit: 10,
        } as any,
        mockUser as any,
      );

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          creatorId: 'user-1',
        },
        skip: 0,
        take: 10,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
          taskTags: {
            include: {
              tag: true,
            },
            where: {
              tag: {
                deletedAt: null,
              },
            },
          },
        },
      });

      expect(mockPrisma.task.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          creatorId: 'user-1',
        },
      });

      expect(result).toEqual({
        data: [
          {
            id: 'task-1',
            title: 'Task 1',
            status: TaskStatus.PENDING,
            expiredAt,
            tags: [
              {
                id: 'tag-1',
                title: 'Tag 1',
              },
            ],
          },
        ],
        meta: {
          total: 1,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });

    it('should apply filters including tagId', async () => {
      mockPrisma.taskTag.findMany.mockResolvedValue([
        { id: 'tt-1', taskId: 'task-1', tagId: 'tag-1' },
        { id: 'tt-2', taskId: 'task-2', tagId: 'tag-1' },
      ]);

      mockPrisma.task.findMany.mockResolvedValue([]);
      mockPrisma.task.count.mockResolvedValue(0);

      await service.getList(
        {
          page: 2,
          limit: 5,
          status: TaskStatus.PENDING,
          title: 'Task',
          expiredAt,
          tagId: 'tag-1',
        } as any,
        mockUser as any,
      );

      expect(mockPrisma.taskTag.findMany).toHaveBeenCalledWith({
        where: {
          tagId: 'tag-1',
        },
      });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          creatorId: 'user-1',
          status: TaskStatus.PENDING,
          title: {
            contains: 'Task',
            mode: 'insensitive',
          },
          expiredAt: {
            lte: expiredAt,
          },
          id: {
            in: ['task-1', 'task-2'],
          },
        },
        skip: 5,
        take: 5,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
          taskTags: {
            include: {
              tag: true,
            },
            where: {
              tag: {
                deletedAt: null,
              },
            },
          },
        },
      });

      expect(mockPrisma.task.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          creatorId: 'user-1',
          status: TaskStatus.PENDING,
          title: {
            contains: 'Task',
            mode: 'insensitive',
          },
          expiredAt: {
            lte: expiredAt,
          },
          id: {
            in: ['task-1', 'task-2'],
          },
        },
      });
    });

    it('should return empty data with correct meta when no tasks found', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);
      mockPrisma.task.count.mockResolvedValue(0);

      const result = await service.getList(
        {
          page: 1,
          limit: 10,
        } as any,
        mockUser as any,
      );

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
        },
      });
    });
  });

  describe('getDetail', () => {
    it('should return task detail with tagIds', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({
        id: 'task-1',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.PENDING,
        creatorId: 'user-1',
        expiredAt,
        createdAt,
        updatedAt,
      });

      mockPrisma.taskTag.findMany.mockResolvedValue([
        { id: 'tt-1', taskId: 'task-1', tagId: 'tag-1' },
        { id: 'tt-2', taskId: 'task-1', tagId: 'tag-2' },
      ]);

      const result = await service.getDetail('task-1', mockUser as any);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'task-1',
          deletedAt: null,
          creatorId: 'user-1',
        },
      });

      expect(mockPrisma.taskTag.findMany).toHaveBeenCalledWith({
        where: {
          taskId: 'task-1',
        },
      });

      expect(result).toEqual({
        id: 'task-1',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.PENDING,
        creatorId: 'user-1',
        expiredAt,
        createdAt,
        updatedAt,
        tagIds: ['tag-1', 'tag-2'],
      });
    });

    it('should throw NotFoundException when task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.getDetail('task-1', mockUser as any),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.getDetail('task-1', mockUser as any),
      ).rejects.toThrow('Task not found!');
    });
  });

  describe('update', () => {
    it('should update task and tagIds, then return id', async () => {
      const dto = {
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
        tagIds: ['tag-1', 'tag-2'],
      };

      mockPrisma.task.update.mockResolvedValue({
        id: 'task-1',
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
        status: TaskStatus.PENDING,
        creatorId: 'user-1',
      });

      mockPrisma.taskTag.deleteMany.mockResolvedValue({ count: 1 });
      mockPrisma.taskTag.createMany.mockResolvedValue({ count: 2 });

      const result = await service.update(
        'task-1',
        dto as any,
        mockUser as any,
      );

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: {
          id: 'task-1',
          deletedAt: null,
          creatorId: 'user-1',
        },
        data: {
          title: 'Updated task',
          description: 'Updated description',
          expiredAt,
        },
      });

      expect(mockPrisma.taskTag.deleteMany).toHaveBeenCalledWith({
        where: {
          taskId: 'task-1',
        },
      });

      expect(mockPrisma.taskTag.createMany).toHaveBeenCalledWith({
        data: [
          { taskId: 'task-1', tagId: 'tag-1' },
          { taskId: 'task-1', tagId: 'tag-2' },
        ],
      });

      expect(result).toEqual({
        id: 'task-1',
      });
    });

    it('should update task without updating tagIds when tagIds is undefined', async () => {
      const dto = {
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
      };

      mockPrisma.task.update.mockResolvedValue({
        id: 'task-1',
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
        status: TaskStatus.PENDING,
        creatorId: 'user-1',
      });

      const result = await service.update(
        'task-1',
        dto as any,
        mockUser as any,
      );

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: {
          id: 'task-1',
          deletedAt: null,
          creatorId: 'user-1',
        },
        data: {
          title: 'Updated task',
          description: 'Updated description',
          expiredAt,
        },
      });

      expect(mockPrisma.taskTag.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.taskTag.createMany).not.toHaveBeenCalled();

      expect(result).toEqual({
        id: 'task-1',
      });
    });

    it('should delete all tags and not recreate when tagIds is empty array', async () => {
      const dto = {
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
        tagIds: [],
      };

      mockPrisma.task.update.mockResolvedValue({
        id: 'task-1',
        title: 'Updated task',
        description: 'Updated description',
        expiredAt,
        status: TaskStatus.PENDING,
        creatorId: 'user-1',
      });

      mockPrisma.taskTag.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.update(
        'task-1',
        dto as any,
        mockUser as any,
      );

      expect(mockPrisma.taskTag.deleteMany).toHaveBeenCalledWith({
        where: {
          taskId: 'task-1',
        },
      });

      expect(mockPrisma.taskTag.createMany).not.toHaveBeenCalled();

      expect(result).toEqual({
        id: 'task-1',
      });
    });
  });

  describe('delete', () => {
    it('should soft delete task', async () => {
      mockPrisma.task.update.mockResolvedValue({
        id: 'task-1',
      });

      await service.delete('task-1', mockUser as any);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: {
          id: 'task-1',
          creatorId: 'user-1',
        },
        data: {
          deletedAt: expect.any(Date),
        },
      });
    });
  });

  describe('getTaskWithAI', () => {
    const mockedGoogleGenAI = GoogleGenAI as jest.Mock;

    it('should return parsed tasks from AI response', async () => {
      const generateContent = jest.fn().mockResolvedValue({
        text: `[
          {
            "title": "Task 1",
            "description": "Description 1",
            "expiredAt": "2026-04-10T00:00:00.000Z"
          }
        ]`,
      });

      mockedGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent,
        },
      }));

      const result = await service.getTaskWithAI('create tasks for me');

      expect(generateContent).toHaveBeenCalled();
      expect(result).toEqual([
        {
          title: 'Task 1',
          description: 'Description 1',
          expiredAt: '2026-04-10T00:00:00.000Z',
        },
      ]);
    });

    it('should parse json wrapped in markdown code block', async () => {
      const generateContent = jest.fn().mockResolvedValue({
        text: '```json\n[{"title":"Task 1","description":"Description 1","expiredAt":"2026-04-10T00:00:00.000Z"}]\n```',
      });

      mockedGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent,
        },
      }));

      const result = await service.getTaskWithAI('create tasks for me');

      expect(result).toEqual([
        {
          title: 'Task 1',
          description: 'Description 1',
          expiredAt: '2026-04-10T00:00:00.000Z',
        },
      ]);
    });

    it('should throw InternalServerErrorException when AI response text is empty', async () => {
      const generateContent = jest.fn().mockResolvedValue({
        text: '',
      });

      mockedGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent,
        },
      }));

      await expect(service.getTaskWithAI('create tasks')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw BadRequestException when AI response is invalid JSON', async () => {
      const generateContent = jest.fn().mockResolvedValue({
        text: 'invalid-json',
      });

      mockedGoogleGenAI.mockImplementation(() => ({
        models: {
          generateContent,
        },
      }));

      await expect(service.getTaskWithAI('create tasks')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
