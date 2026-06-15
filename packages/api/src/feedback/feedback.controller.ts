import {
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  createHostInquirySchema,
  createListingReportSchema,
  type CreateHostInquiryInput,
  type CreateListingReportInput,
} from '@seanb/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { ZodBody } from '../common/pipes/zod-validation.pipe';
import { FeedbackService } from './feedback.service';

type AuthUser = {
  id: string;
};

@Controller('listings/:slug')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('inquiries')
  @UseGuards(OptionalJwtAuthGuard)
  createInquiry(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthUser | null,
    @ZodBody(createHostInquirySchema) dto: CreateHostInquiryInput,
  ) {
    return this.feedbackService.createInquiry(slug, dto, user?.id);
  }

  @Post('reports')
  @UseGuards(OptionalJwtAuthGuard)
  createReport(
    @Param('slug') slug: string,
    @CurrentUser() user: AuthUser | null,
    @ZodBody(createListingReportSchema) dto: CreateListingReportInput,
  ) {
    return this.feedbackService.createReport(slug, dto, user?.id);
  }
}
