import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private databaseService: DatabaseService) {}

  private async validateAssigneeMembership(
    projectId: string,
    assigneeId: string,
  ) {
    const isMember = await this.databaseService.projectMember.findUnique({
      where: {
        memberId_projectId: {
          memberId: assigneeId,
          projectId: projectId,
        },
      },
    });

    if (!isMember) {
      throw new BadRequestException(
        'The assigned user must be a member of this project.',
      );
    }
  }

  async create(dto: CreateTaskDto) {
    if (dto.assigneeId) {
      await this.validateAssigneeMembership(dto.projectId, dto.assigneeId);
    }
    return this.databaseService.task.create({ data: dto });
  }

  async findAll() {
    return this.databaseService.task.findMany({
      include: {
        project: { select: { title: true } },
        assignee: { select: { name: true, email: true } },
      },
    });
  }

  async findOne(id: string) {
    const task = await this.databaseService.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true } },
        assignee: { select: { name: true, email: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    if (dto.assigneeId) {
      let projectId = dto.projectId;

      if (!projectId) {
        const currentTask = await this.findOne(id);
        projectId = currentTask.projectId;
      }

      await this.validateAssigneeMembership(projectId, dto.assigneeId);
    }

    return this.databaseService.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.databaseService.task.delete({ where: { id } });
  }
}
