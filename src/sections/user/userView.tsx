import { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from '../../components/iconify';

import { TableNoData } from '../../utils/table/tableNoData';
import { UserTableRow } from './userTableRow';
import { CustomTableHead } from '../../utils/table/tableHead';
import { TableEmptyRows } from '../../utils/table/tableEmptyRows';

import type { UserProps } from './userTableRow';
import axiosInstance from 'src/settings/axiosInstance';
import SimpleBar from 'simplebar-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { handleError } from 'src/utils/errorHandler';
import { CustomTableToolbar } from 'src/utils/table/tableToolbar';
import { emptyRows, getComparator } from 'src/utils/table/utils';
import UserEditModal, { UserPropsModal } from 'src/components/modals/userModal';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';

const SimpleBarWrapper = styled.div`
  height: 100% !important;

  .simplebar-placeholder {
    display: none !important;
  }

  .simplebar-wrapper,
  .simplebar-content {
    height: 100% !important;
  }
`;

const User: React.FC = () => <UserView />;

function UserView() {
  const table = useTable();
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserProps[]>([]);
  const [filterRoomNumber, setFilterRoomNumber] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get('admin/getUsers', { withCredentials: true })
      .then((response) => setUsers(response.data.data))
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }, []);

  const updateUserFromUsers = (userProps: UserPropsModal) => {
    setUsers((users) =>
      users.map((u) =>
        u.roomNumber === userProps.roomNumber
          ? {
              ...u,
              username: userProps.username,
              email: userProps.email,
              isAdmin: userProps.isAdmin,
              isActive: userProps.isActive,
            }
          : u
      )
    );
  };

  const addUserInUsers = (userProps: UserProps) => {
    setUsers((users) => [...users, userProps]);
  };

  const deleteRows = async (roomNumbers: number[]) => {
    if (roomNumbers.length < 1) return;

    const confirmed = window.confirm(
      t('user.confirmDelete', { roomNumbers: roomNumbers.join(' ') })
    );
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete('admin/user', {
        data: {
          roomNumbers,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setUsers((users) =>
          users.filter((user) => !roomNumbers.includes(user.roomNumber))
        );
        toast.success(t('user.deleted.success'));
      } else {
        throw new Error();
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      table.onResetSelection();
    }
  };

  type ApplyFilterProps = {
    inputData: UserProps[];
    filterRoomNumber: string;
    comparator: (a: any, b: any) => number;
  };

  function applyFilter({
    inputData,
    comparator,
    filterRoomNumber,
  }: ApplyFilterProps) {
    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterRoomNumber) {
      inputData = inputData.filter(
        (user) => String(user.roomNumber).indexOf(filterRoomNumber) !== -1
      );
    }

    return inputData;
  }

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: users,
        comparator: getComparator(table.order, table.orderBy),
        filterRoomNumber,
      }),
    [users, table.order, table.orderBy, filterRoomNumber]
  );

  const notFound = !dataFiltered.length && filterRoomNumber;

  const handleOpenModal = (user: UserProps) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <DashboardContent>
      {isLoading ? (
        <LoadingSpinner translationKey="checking.auth" />
      ) : (
        <Box>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              {t('users')}
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setSelectedUser(null);
                setOpenModal(true);
              }}
            >
              {t('new.user')}
            </Button>
          </Box>

          <Card>
            <CustomTableToolbar
              numSelected={table.selected.length}
              filter={filterRoomNumber}
              onFilter={(event) => {
                setFilterRoomNumber(event.target.value);
                table.onResetPage();
              }}
              onDeleteSelected={() => deleteRows(table.selected ?? [])}
            />

            <SimpleBarWrapper>
              <TableContainer sx={{ maxHeight: 500, overflow: 'auto' }}>
                <SimpleBar autoHide={true}>
                  <Table sx={{ minWidth: 800 }}>
                    <CustomTableHead
                      order={table.order}
                      orderBy={table.orderBy}
                      rowCount={users.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          users.map((user) => user.roomNumber)
                        )
                      }
                      headLabel={[
                        { id: 'roomNumber', label: t('room.number') },
                        { id: 'username', label: t('username') },
                        { id: 'email', label: t('email') },
                        { id: 'isActive', label: t('active'), align: 'center' },
                        { id: 'isAdmin', label: t('admin') },
                        { id: '', label: '' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <UserTableRow
                            key={row.roomNumber}
                            row={row}
                            selected={table.selected.includes(row.roomNumber)}
                            onSelectRow={() =>
                              table.onSelectRow(row.roomNumber)
                            }
                            onEditRow={(user) => handleOpenModal(user)}
                            onDeleteRow={(roomNumber) =>
                              deleteRows([roomNumber])
                            }
                          />
                        ))}

                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(
                          table.page,
                          table.rowsPerPage,
                          users.length
                        )}
                      />

                      {notFound && (
                        <TableNoData searchQuery={filterRoomNumber} />
                      )}
                    </TableBody>
                  </Table>
                </SimpleBar>
              </TableContainer>
            </SimpleBarWrapper>

            <TablePagination
              labelRowsPerPage={t('rows.per.page')}
              labelDisplayedRows={({ from, to, count }) =>
                t('table.from.to.count', { from, to, count })
              }
              component="div"
              page={table.page}
              count={users.length}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          </Card>
        </Box>
      )}

      <UserEditModal
        open={openModal}
        onClose={handleCloseModal}
        user={selectedUser}
        onUserUpdated={(userProps) => updateUserFromUsers(userProps)}
        onUserCreated={(userProps) => addUserInUsers(userProps)}
      />
    </DashboardContent>
  );
}

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('roomNumber');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const onResetSelection = useCallback(() => setSelected([]), []);

  const onSort = useCallback(
    (id: string) => {
      setOrder(orderBy === id && order === 'asc' ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds: number[]) => {
      setSelected(checked ? newSelecteds : []);
    },
    []
  );

  const onSelectRow = useCallback((roomNumber: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(roomNumber)
        ? prevSelected.filter((item) => item !== roomNumber)
        : [...prevSelected, roomNumber]
    );
  }, []);

  const onResetPage = useCallback(() => setPage(0), []);
  const onChangePage = useCallback(
    (_event: any, newPage: number) => setPage(newPage),
    []
  );
  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    onSort,
    onSelectRow,
    setSelected,
    onResetSelection,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

export default User;
