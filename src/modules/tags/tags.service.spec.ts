import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/libs/database/prisma.service';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  const mockPrisma = {
    tag: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const createdAt = new Date('2026-04-01T00:00:00.000Z');
  const updatedAt = new Date('2026-04-02T00:00:00.000Z');

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create tag and return id when tag does not exist', async () => {
      const dto = {
        title: 'Tag 1',
        description: 'Description 1',
      };

      mockPrisma.tag.findFirst.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue({
        id: 'tag-1',
        title: 'Tag 1',
        description: 'Description 1',
        createdAt,
        updatedAt,
      });

      const result = await service.create(dto as any);

      expect(mockPrisma.tag.findFirst).toHaveBeenCalledWith({
        where: {
          title: 'Tag 1',
          deletedAt: null,
        },
      });

      expect(mockPrisma.tag.create).toHaveBeenCalledWith({
        data: dto,
      });

      expect(result).toEqual({
        id: 'tag-1',
      });
    });

    it('should throw ConflictException when tag already exists', async () => {
      const dto = {
        title: 'Tag 1',
        description: 'Description 1',
      };

      mockPrisma.tag.findFirst.mockResolvedValue({
        id: 'tag-1',
        title: 'Tag 1',
      });

      await expect(service.create(dto as any)).rejects.toThrow(
        ConflictException,
      );

      await expect(service.create(dto as any)).rejects.toThrow(
        'Tag is existed!',
      );

      expect(mockPrisma.tag.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated tags without title filter', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([
        {
          id: 'tag-1',
          title: 'Tag 1',
          description: 'Description 1',
          createdAt,
          updatedAt,
          deletedAt: null,
        },
      ]);
      mockPrisma.tag.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      } as any);

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(mockPrisma.tag.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
      });

      expect(result).toEqual({
        data: [
          {
            id: 'tag-1',
            title: 'Tag 1',
            description: 'Description 1',
            createdAt,
            updatedAt,
          },
        ],
        meta: {
          total: 1,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });

    it('should apply title filter when provided', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([]);
      mockPrisma.tag.count.mockResolvedValue(0);

      await service.findAll({
        page: 2,
        limit: 5,
        title: 'Tag',
      } as any);

      expect(mockPrisma.tag.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          title: {
            contains: 'Tag',
            mode: 'insensitive',
          },
        },
        skip: 5,
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(mockPrisma.tag.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          title: {
            contains: 'Tag',
            mode: 'insensitive',
          },
        },
      });
    });

    it('should return empty data with correct meta when no tags found', async () => {
      mockPrisma.tag.findMany.mockResolvedValue([]);
      mockPrisma.tag.count.mockResolvedValue(0);

      const result = await service.findAll({
        page: 1,
        limit: 10,
      } as any);

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

  describe('findOne', () => {
    it('should return tag detail when found', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue({
        id: 'tag-1',
        title: 'Tag 1',
        description: 'Description 1',
        createdAt,
        updatedAt,
        deletedAt: null,
      });

      const result = await service.findOne('tag-1');

      expect(mockPrisma.tag.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'tag-1',
          deletedAt: null,
        },
      });

      expect(result).toEqual({
        id: 'tag-1',
        title: 'Tag 1',
        description: 'Description 1',
        createdAt,
        updatedAt,
      });
    });

    it('should throw NotFoundException when tag not found', async () => {
      mockPrisma.tag.findUnique.mockResolvedValue(null);

      await expect(service.findOne('tag-1')).rejects.toThrow(NotFoundException);

      await expect(service.findOne('tag-1')).rejects.toThrow('Task not found!');
    });
  });

  describe('update', () => {
    it('should update tag and return id', async () => {
      const dto = {
        title: 'Updated Tag',
        description: 'Updated Description',
      };

      mockPrisma.tag.update.mockResolvedValue({
        id: 'tag-1',
        title: 'Updated Tag',
        description: 'Updated Description',
        createdAt,
        updatedAt,
      });

      const result = await service.update('tag-1', dto as any);

      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: {
          id: 'tag-1',
          deletedAt: null,
        },
        data: dto,
      });

      expect(result).toEqual({
        id: 'tag-1',
      });
    });
  });

  describe('remove', () => {
    it('should soft delete tag', async () => {
      mockPrisma.tag.update.mockResolvedValue({
        id: 'tag-1',
      });

      await service.remove('tag-1');

      expect(mockPrisma.tag.update).toHaveBeenCalledWith({
        where: {
          id: 'tag-1',
          deletedAt: null,
        },
        data: {
          deletedAt: expect.any(Date),
        },
      });
    });
  });
});
