import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { ReactNode } from 'react';

interface Column {
    id: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    sx?: any;
    [key: string]: any;
}

export const Table = ({ columns, data, ...props }: TableProps) => {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 4,
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 157, 0.1)',
                boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)',
                overflow: 'hidden',
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: '0 4px',
                },
                ...props.sx
            }}
        >
            <MuiTable>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={{
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    borderBottom: '2px solid',
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(0, 255, 157, 0.05)',
                                    py: 2,
                                    px: 3,
                                    textShadow: '0 0 5px rgba(0, 255, 157, 0.3)',
                                    '&:first-of-type': {
                                        borderTopLeftRadius: 8,
                                    },
                                    '&:last-child': {
                                        borderTopRightRadius: 8,
                                    },
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 255, 157, 0.05)',
                                    '& td': {
                                        borderColor: 'rgba(0, 255, 157, 0.2)',
                                    },
                                },
                                transition: 'all 0.3s ease-in-out',
                                '& td': {
                                    borderBottom: '1px solid rgba(0, 255, 157, 0.1)',
                                    py: 2,
                                    px: 3,
                                    color: 'text.primary',
                                    '&:first-of-type': {
                                        borderLeft: '1px solid rgba(0, 255, 157, 0.1)',
                                        borderTopLeftRadius: 8,
                                        borderBottomLeftRadius: 8,
                                    },
                                    '&:last-child': {
                                        borderRight: '1px solid rgba(0, 255, 157, 0.1)',
                                        borderTopRightRadius: 8,
                                        borderBottomRightRadius: 8,
                                    },
                                },
                            }}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                >
                                    {column.render ? column.render(row[column.id], row) : row[column.id]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
}; 