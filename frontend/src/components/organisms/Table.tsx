import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
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
        <TableContainer component={Paper} sx={{ overflow: 'hidden', ...props.sx }}>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Sin registros
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow key={index} hover>
                                {columns.map((column) => (
                                    <TableCell key={column.id}>
                                        {column.render ? column.render(row[column.id], row) : row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};
