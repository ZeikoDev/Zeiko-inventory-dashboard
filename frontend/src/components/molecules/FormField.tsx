import { Box, Typography, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type FormFieldProps = TextFieldProps & {
  label: string;
  errorText?: string;
};

export const FormField = ({ label, errorText, ...props }: FormFieldProps) => (
  <Box>
    <Typography variant="subtitle2" mb={0.5}>{label}</Typography>
    <TextField {...props} error={!!errorText} />
    {errorText && <Typography color="error" variant="caption">{errorText}</Typography>}
  </Box>
); 