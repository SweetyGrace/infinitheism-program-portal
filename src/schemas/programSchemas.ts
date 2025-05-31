
import { z } from 'zod';

export const subProgramSchema = z.object({
  title: z.string().min(1, "Sub-program title is required"),
  banner: z.any().optional(),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  modeOfProgram: z.enum(['online', 'offline', 'hybrid'], { required_error: "Please select a mode" }),
  venueAddress: z.array(z.string()).optional(),
  customVenue: z.string().optional(),
  isTravelRequired: z.enum(['yes', 'no']).optional(),
  isResidential: z.enum(['yes', 'no']).optional(),
  isPaymentRequired: z.enum(['yes', 'no']),
  currency: z.string().optional(),
  programFee: z.string().optional(),
});

export const programDetailsSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  programBanner: z.any().optional(),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  modeOfProgram: z.enum(['online', 'offline', 'hybrid'], { required_error: "Please select a mode" }),
  venueAddress: z.array(z.string()).optional(),
  customVenue: z.string().optional(),
  isTravelRequired: z.enum(['yes', 'no']).optional(),
  isResidential: z.enum(['yes', 'no']).optional(),
  isPaymentRequired: z.enum(['yes', 'no']),
  currency: z.string().optional(),
  programFee: z.string().optional(),
  registrationStartDate: z.date().optional(),
  registrationStartTime: z.string().optional(),
  registrationEndDate: z.date().optional(),
  registrationEndTime: z.string().optional(),
  approvalRequired: z.enum(['yes', 'no']),
  hasSeatLimit: z.enum(['yes', 'no']),
  seatLimit: z.string().optional(),
  hasWaitlist: z.enum(['yes', 'no']),
  waitlistTriggerCount: z.string().optional(),
  subPrograms: z.array(subProgramSchema),
});
