import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskResponseDto } from '../dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get workspace tasks' })
  @ApiResponse({ type: [TaskResponseDto] })
  findAll(): TaskResponseDto[] {
    return this.tasksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ type: TaskResponseDto, status: 201 })
  create(@Body() createTaskDto: CreateTaskDto): TaskResponseDto {
    return this.tasksService.create(createTaskDto);
  }
}
