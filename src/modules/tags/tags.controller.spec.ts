import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let controller: TagsController;

  const mockTagsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: mockTagsService,
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call tagsService.create with correct data and return id', async () => {
      const dto = {
        title: 'Tag 1',
        description: 'Description 1',
      };

      const mockResponse = {
        id: 'tag-1',
      };

      mockTagsService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto as any);

      expect(mockTagsService.create).toHaveBeenCalledTimes(1);
      expect(mockTagsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findAll', () => {
    it('should call tagsService.findAll with query and return paginated tags', async () => {
      const query = {
        page: 1,
        limit: 10,
        title: 'Tag',
      };

      const mockResponse = {
        data: [
          {
            id: 'tag-1',
            title: 'Tag 1',
            description: 'Description 1',
            createdAt: new Date('2026-04-01T00:00:00.000Z'),
            updatedAt: new Date('2026-04-02T00:00:00.000Z'),
          },
        ],
        meta: {
          total: 1,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockTagsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query as any);

      expect(mockTagsService.findAll).toHaveBeenCalledTimes(1);
      expect(mockTagsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call tagsService.findOne with id and return tag detail', async () => {
      const mockResponse = {
        id: 'tag-1',
        title: 'Tag 1',
        description: 'Description 1',
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
        updatedAt: new Date('2026-04-02T00:00:00.000Z'),
      };

      mockTagsService.findOne.mockResolvedValue(mockResponse);

      const result = await controller.findOne('tag-1');

      expect(mockTagsService.findOne).toHaveBeenCalledTimes(1);
      expect(mockTagsService.findOne).toHaveBeenCalledWith('tag-1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call tagsService.update with id and data, then return id', async () => {
      const dto = {
        title: 'Updated Tag',
        description: 'Updated Description',
      };

      const mockResponse = {
        id: 'tag-1',
      };

      mockTagsService.update.mockResolvedValue(mockResponse);

      const result = await controller.update('tag-1', dto as any);

      expect(mockTagsService.update).toHaveBeenCalledTimes(1);
      expect(mockTagsService.update).toHaveBeenCalledWith('tag-1', dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('remove', () => {
    it('should call tagsService.remove with id', async () => {
      mockTagsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('tag-1');

      expect(mockTagsService.remove).toHaveBeenCalledTimes(1);
      expect(mockTagsService.remove).toHaveBeenCalledWith('tag-1');
      expect(result).toBeUndefined();
    });
  });
});
