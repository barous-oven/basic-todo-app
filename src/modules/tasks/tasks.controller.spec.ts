import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import type { TUserPayload } from '../auth/auth.type';
import { CreateTaskRequestDto } from './dto/create.dto';
import { UpdateTaskRequestDto } from './dto/update.dto';
import { GetListTaskRequestDto } from './dto/get-list.dto';
import { GetAIGeneratedTaskRequestDto } from './dto/get-ai-generated-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  const mockUser: TUserPayload = {
    userId: 'user-id-123',
    type: 'ACCESS',
  };

  const mockTasksService = {
    create: jest.fn(),
    createMany: jest.fn(),
    getList: jest.fn(),
    getDetail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTaskWithAI: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get(TasksService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call tasksService.create and return ResponseIdDto', async () => {
      const dto: CreateTaskRequestDto = {
        title: 'Test task',
        description: 'Test description',
      } as CreateTaskRequestDto;

      const expectedResult = { id: 'task-id-1' };
      tasksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, mockUser);

      expect(tasksService.create).toHaveBeenCalledTimes(1);
      expect(tasksService.create).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createMany', () => {
    it('should call tasksService.createMany', async () => {
      const dto: CreateTaskRequestDto[] = [
        {
          title: 'Task 1',
          description: 'Description 1',
        } as CreateTaskRequestDto,
        {
          title: 'Task 2',
          description: 'Description 2',
        } as CreateTaskRequestDto,
      ];

      tasksService.createMany.mockResolvedValue(undefined);

      const result = await controller.createMany(dto, mockUser);

      expect(tasksService.createMany).toHaveBeenCalledTimes(1);
      expect(tasksService.createMany).toHaveBeenCalledWith(dto, mockUser);
      expect(result).toBeUndefined();
    });
  });

  describe('getList', () => {
    it('should call tasksService.getList and return paginated result', async () => {
      const query: GetListTaskRequestDto = {
        page: 1,
        limit: 10,
      } as GetListTaskRequestDto;

      const expectedResult = {
        items: [
          {
            id: 'task-1',
            title: 'Task 1',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      tasksService.getList.mockResolvedValue(expectedResult as any);

      const result = await controller.getList(query, mockUser);

      expect(tasksService.getList).toHaveBeenCalledTimes(1);
      expect(tasksService.getList).toHaveBeenCalledWith(query, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDetail', () => {
    it('should call tasksService.getDetail and return task detail', async () => {
      const taskId = 'task-id-1';
      const expectedResult = {
        id: taskId,
        title: 'Task detail',
        description: 'Task description',
      };

      tasksService.getDetail.mockResolvedValue(expectedResult as any);

      const result = await controller.getDetail(taskId, mockUser);

      expect(tasksService.getDetail).toHaveBeenCalledTimes(1);
      expect(tasksService.getDetail).toHaveBeenCalledWith(taskId, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call tasksService.update and return ResponseIdDto', async () => {
      const taskId = 'task-id-1';
      const dto: UpdateTaskRequestDto = {
        title: 'Updated title',
      } as UpdateTaskRequestDto;

      const expectedResult = { id: taskId };
      tasksService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(taskId, dto, mockUser);

      expect(tasksService.update).toHaveBeenCalledTimes(1);
      expect(tasksService.update).toHaveBeenCalledWith(taskId, dto, mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should call tasksService.delete', async () => {
      const taskId = 'task-id-1';
      tasksService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(taskId, mockUser);

      expect(tasksService.delete).toHaveBeenCalledTimes(1);
      expect(tasksService.delete).toHaveBeenCalledWith(taskId, mockUser);
      expect(result).toBeUndefined();
    });
  });

  describe('getTaskWithAI', () => {
    it('should call tasksService.getTaskWithAI and return generated tasks', async () => {
      const body: GetAIGeneratedTaskRequestDto = {
        requirement: 'Build a todo app with auth',
      };

      const expectedResult = [
        {
          title: 'Setup auth',
          description: 'Implement JWT authentication',
        },
        {
          title: 'Create task module',
          description: 'Implement CRUD for tasks',
        },
      ];

      tasksService.getTaskWithAI.mockResolvedValue(expectedResult as any);

      const result = await controller.getTaskWithAI(body);

      expect(tasksService.getTaskWithAI).toHaveBeenCalledTimes(1);
      expect(tasksService.getTaskWithAI).toHaveBeenCalledWith(body.requirement);
      expect(result).toEqual(expectedResult);
    });
  });
});
