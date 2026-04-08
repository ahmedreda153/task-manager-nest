import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateProjectDto) {
    return this.databaseService.project.create({ data: dto });
  }

  async findAll() {
    return this.databaseService.project.findMany();
  }

  async findOne(id: string) {
    const project = await this.databaseService.project.findUnique({
      where: { id },
      include: {
        members: true,
        _count: { select: { tasks: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    return this.databaseService.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.databaseService.project.delete({ where: { id } });
  }

  async addMember(projectId: string, memberId: string) {
    return this.databaseService.projectMember.create({
      data: {
        projectId,
        memberId,
      },
      include: {
        member: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async removeMember(projectId: string, memberId: string) {
    return this.databaseService.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: {
          projectId,
          assigneeId: memberId,
        },
        data: {
          assigneeId: null,
        },
      });

      return tx.projectMember.delete({
        where: {
          memberId_projectId: {
            memberId,
            projectId,
          },
        },
      });
    });
  }
}
