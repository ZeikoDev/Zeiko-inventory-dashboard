import { Paper, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    sx?: any;
    [key: string]: any;
}

export const Card = ({ children, ...props }: CardProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 157, 0.1)',
                boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0, 255, 157, 0.1), rgba(0, 255, 255, 0.1))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                    zIndex: 0,
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 30px rgba(0, 255, 157, 0.2)',
                    border: '1px solid rgba(0, 255, 157, 0.2)',
                    '&::before': {
                        opacity: 1,
                    },
                },
                ...props.sx
            }}
            {...props}
        >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {children}
            </Box>
        </Paper>
    );
}; 