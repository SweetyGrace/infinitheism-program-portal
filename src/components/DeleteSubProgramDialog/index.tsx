
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

interface DeleteSubProgramDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSubProgramDialog = ({ open, onClose, onConfirm }: DeleteSubProgramDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Sub-Program</DialogTitle>
      <DialogContent sx={{ py: 1.5 }}>
        <Typography>Are you sure you want to delete this sub-program? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, p: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSubProgramDialog;
