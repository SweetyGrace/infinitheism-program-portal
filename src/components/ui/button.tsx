
import * as React from "react"
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme, variant, size }) => ({
  textTransform: 'none',
  fontWeight: 500,
  ...(variant === 'contained' && {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  }),
  ...(size === 'small' && {
    height: '36px',
    fontSize: '0.875rem',
  }),
  ...(size === 'large' && {
    height: '44px',
    fontSize: '1rem',
  }),
}));

export interface ButtonProps extends Omit<MuiButtonProps, 'size'> {
  size?: 'small' | 'medium' | 'large';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "contained", size = "medium", ...props }, ref) => {
    // Map variants for compatibility
    const muiVariant = variant === 'ghost' ? 'text' : 
                      variant === 'outline' ? 'outlined' : 
                      variant as 'text' | 'outlined' | 'contained';
    
    return (
      <StyledButton ref={ref} variant={muiVariant} size={size} {...props}>
        {children}
      </StyledButton>
    )
  }
)
Button.displayName = "Button"

export { Button }
