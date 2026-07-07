import { Paper } from '@mui/material';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    sx?: any;
    [key: string]: any;
}

export const Card = ({ children, sx, ...props }: CardProps) => {
    return (
        <Paper sx={{ p: 3, ...sx }} {...props}>
            {children}
        </Paper>
    );
};
