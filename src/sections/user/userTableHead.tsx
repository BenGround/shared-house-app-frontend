import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

type HeadCell = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
};

type UserTableHeadProps = {
  orderBy: string;
  rowCount: number;
  numSelected: number;
  order: 'asc' | 'desc';
  onSort: (columnId: string) => void;
  headLabel: HeadCell[];
  onSelectAllRows: (isChecked: boolean) => void;
};

export function UserTableHead({
  order,
  onSort,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onSelectAllRows,
}: UserTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event) => onSelectAllRows(event.target.checked)}
          />
        </TableCell>

        {headLabel.map(({ id, label, align = 'left', width, minWidth }) => (
          <TableCell
            key={id}
            align={align}
            sortDirection={orderBy === id ? order : false}
            sx={{ width, minWidth }}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={orderBy === id ? order : 'asc'}
              onClick={() => onSort(id)}
              hideSortIcon
            >
              {label}
              {orderBy === id && (
                <Box sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
