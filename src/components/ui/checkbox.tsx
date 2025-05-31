
import * as React from "react"
import { Checkbox as MuiCheckbox, CheckboxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  width: '16px',
  height: '16px',
  padding: 0,
  '& .MuiSvgIcon-root': {
    fontSize: '16px',
  },
}));

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxProps
>(({ ...props }, ref) => (
  <StyledCheckbox ref={ref} {...props} />
));
Checkbox.displayName = "Checkbox";

export { Checkbox }
