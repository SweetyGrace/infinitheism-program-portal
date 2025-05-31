
import * as React from "react"
import { 
  MenuList, 
  MenuItem, 
  Menu, 
  Button, 
  Divider,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Radio,
  Box,
  Paper
} from '@mui/material';
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import './menubar.css'

const MenubarMenu = ({ children, ...props }: { children: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

const MenubarGroup = ({ children, ...props }: { children: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

const MenubarPortal = ({ children, ...props }: { children: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

const MenubarSub = ({ children, ...props }: { children: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

const MenubarRadioGroup = ({ children, ...props }: { children: React.ReactNode }) => (
  <div {...props}>{children}</div>
);

const Menubar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Paper
    ref={ref}
    className={cn("menubar", className)}
    elevation={1}
    {...props}
  >
    {children}
  </Paper>
))
Menubar.displayName = "Menubar"

const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { asChild?: boolean }
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="text"
    className={cn("menubar-trigger", className)}
    {...props}
  >
    {children}
  </Button>
))
MenubarTrigger.displayName = "MenubarTrigger"

const MenubarSubTrigger = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenuItem
    ref={ref}
    className={cn("menubar-sub-trigger", inset && "inset", className)}
    {...props}
  >
    <ListItemText>{children}</ListItemText>
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenuItem>
))
MenubarSubTrigger.displayName = "MenubarSubTrigger"

const MenubarSubContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Paper
    ref={ref}
    className={cn("menubar-sub-content", className)}
    elevation={3}
    {...props}
  >
    <MenuList dense>{children}</MenuList>
  </Paper>
))
MenubarSubContent.displayName = "MenubarSubContent"

const MenubarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: string;
    alignOffset?: number;
    sideOffset?: number;
  }
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, children, ...props },
    ref
  ) => (
    <Paper
      ref={ref}
      className={cn("menubar-content", className)}
      elevation={3}
      {...props}
    >
      <MenuList dense>{children}</MenuList>
    </Paper>
  )
)
MenubarContent.displayName = "MenubarContent"

const MenubarItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuItem
    ref={ref}
    className={cn("menubar-item", inset && "inset", className)}
    {...props}
  />
))
MenubarItem.displayName = "MenubarItem"

const MenubarCheckboxItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <MenuItem
    ref={ref}
    className={cn("menubar-checkbox-item", className)}
    {...props}
  >
    <ListItemIcon>
      <Checkbox checked={checked} size="small" />
    </ListItemIcon>
    <ListItemText>{children}</ListItemText>
  </MenuItem>
))
MenubarCheckboxItem.displayName = "MenubarCheckboxItem"

const MenubarRadioItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <MenuItem
    ref={ref}
    className={cn("menubar-radio-item", className)}
    {...props}
  >
    <ListItemIcon>
      <Radio checked={checked} size="small" />
    </ListItemIcon>
    <ListItemText>{children}</ListItemText>
  </MenuItem>
))
MenubarRadioItem.displayName = "MenubarRadioItem"

const MenubarLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn("menubar-label", inset && "inset", className)}
    {...props}
  />
))
MenubarLabel.displayName = "MenubarLabel"

const MenubarSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <Divider
    ref={ref}
    className={cn("menubar-separator", className)}
    {...props}
  />
))
MenubarSeparator.displayName = "MenubarSeparator"

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("menubar-shortcut", className)}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
