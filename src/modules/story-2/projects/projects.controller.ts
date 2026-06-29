import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectResponseDto } from '../tasks/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects' })
  @ApiResponse({ status: 200, type: [ProjectResponseDto] })
  findAll(): ProjectResponseDto[] {
    return this.projectsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 204 })
  delete(@Param('id') id: string): void {
    return this.projectsService.delete(id);
  }
}
