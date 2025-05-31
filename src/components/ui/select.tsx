
import * as React from "react"
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  SelectProps as MuiSelectProps,
  MenuItemProps,
} from '@mui/material';
import { ChevronDown } from "lucide-react";

const Select = MuiSelect;

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
SelectGroup.displayName = "SelectGroup";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => (
  <span ref={ref} {...props}>
    {children}
  </span>
));
SelectValue.displayName = "SelectValue";

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof MuiSelect>
>(({ children, ...props }, ref) => (
  <FormControl fullWidth size="small">
    <MuiSelect
      ref={ref}
      IconComponent={ChevronDown}
      {...props}
    >
      {children}
    </MuiSelect>
  </FormControl>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <div ref={ref} style={{ padding: '6px 32px 6px 8px', fontSize: '0.875rem', fontWeight: 600 }} {...props}>
    {children}
  </div>
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLLIElement,
  MenuItemProps
>(({ children, ...props }, ref) => (
  <MenuItem ref={ref} {...props}>
    {children}
  </MenuItem>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ ...props }, ref) => (
  <hr ref={ref} style={{ margin: '4px -4px', height: '1px', border: 'none', backgroundColor: '#e0e0e0' }} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
