
import * as React from "react"
import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';

const TooltipProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
TooltipProvider.displayName = "TooltipProvider";

const Tooltip = MuiTooltip;

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof MuiTooltip>
>(({ children, ...props }, ref) => (
  <div ref={ref}>
    {children}
  </div>
));
TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
