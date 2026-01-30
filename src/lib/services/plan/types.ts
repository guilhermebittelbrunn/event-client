import { PlanDTO } from '@/shared/types/dtos/billing/plan';
import { UpdateRequest } from '@/shared/types/utils';

export type UpdatePlanRequest = UpdateRequest<PlanDTO>;

export interface FindPlanByIdResponse {
    data: PlanDTO;
}
