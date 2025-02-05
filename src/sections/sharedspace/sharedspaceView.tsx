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
import { Iconify } from './../../components/iconify';

import { SharedspaceTableRow } from './sharedspaceTableRow';
import { emptyRows, getComparator } from './../../utils/table/utils';

import axiosInstance from 'src/settings/axiosInstance';
import SimpleBar from 'simplebar-react';
import SharedspaceEditModal from '../../components/modals/sharedspaceModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { handleError } from 'src/utils/errorHandler';
import { TableNoData } from 'src/utils/table/tableNoData';
import { TableEmptyRows } from 'src/utils/table/tableEmptyRows';
import { CustomTableHead } from 'src/utils/table/tableHead';
import { CustomTableToolbar } from 'src/utils/table/tableToolbar';
import { useSharedSpaces } from 'src/contexts/shareSpacesContext';
import { isTabletWindows } from 'src/utils/utils';
import { FrontSharedSpace } from '@benhart44/shared-house-shared';

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

const Sharedspace: React.FC = () => <SharedspaceView />;

function SharedspaceView() {
  const table = useTable();
  const { t } = useTranslation();
  const isTablet = isTabletWindows();

  const { sharedSpaces, updateSharedSpaces } = useSharedSpaces();
  const [tableSharedSpaces, setSharedspaces] =
    useState<FrontSharedSpace[]>(sharedSpaces);
  const [filterNameCode, setFilterNameCode] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedSharedspace, setSelectedSharedspace] =
    useState<FrontSharedSpace | null>(null);

  useEffect(() => {
    updateSharedSpaces(tableSharedSpaces);
  }, [tableSharedSpaces]);

  const updateSharedspaceFromList = (
    sharedSpaceProps: FrontSharedSpace,
    nameCode: string
  ) => {
    setSharedspaces((sharedspaces) =>
      sharedspaces.map((actualSharedSpace) =>
        actualSharedSpace.nameCode === nameCode
          ? {
              ...actualSharedSpace,
              nameCode: sharedSpaceProps.nameCode,
              nameEn: sharedSpaceProps.nameEn,
              nameJp: sharedSpaceProps.nameJp,
              descriptionEn: sharedSpaceProps.descriptionEn,
              descriptionJp: sharedSpaceProps.descriptionJp,
              maxBookingByUser: sharedSpaceProps.maxBookingByUser,
              maxBookingHours: sharedSpaceProps.maxBookingHours,
              startDayTime: sharedSpaceProps.startDayTime,
              endDayTime: sharedSpaceProps.endDayTime,
            }
          : actualSharedSpace
      )
    );
  };

  const addSharedspaceInList = (sharedSpaceProps: FrontSharedSpace) => {
    setSharedspaces((sharedspaces) => [...sharedspaces, sharedSpaceProps]);
  };

  const deleteRows = async (nameCodes: string[]) => {
    if (nameCodes.length < 1) return;

    const confirmed = window.confirm(
      t('sharedspace.confirmDelete', { nameCodes: nameCodes.join(' ') })
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete('admin/sharedspace', {
        data: {
          nameCodes,
        },
        withCredentials: true,
      });

      setSharedspaces((sharedSpaces) =>
        sharedSpaces.filter((user) => !nameCodes.includes(user.nameCode))
      );
      toast.success(t('sharedspace.deleted.success'));
    } catch (error: any) {
      handleError(error);
    } finally {
      table.onResetSelection();
    }
  };

  type ApplyFilterProps = {
    inputData: FrontSharedSpace[];
    filterNameCode: string;
    comparator: (a: any, b: any) => number;
  };

  function applyFilter({
    inputData,
    comparator,
    filterNameCode,
  }: ApplyFilterProps) {
    const stabilizedThis = inputData.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (filterNameCode) {
      inputData = inputData.filter(
        (user) => String(user.nameCode).indexOf(filterNameCode) !== -1
      );
    }

    return inputData;
  }

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableSharedSpaces,
        comparator: getComparator(table.order, table.orderBy),
        filterNameCode,
      }),
    [tableSharedSpaces, table.order, table.orderBy, filterNameCode]
  );

  const notFound = !dataFiltered.length && filterNameCode;

  const handleOpenModal = (sharedSpace: FrontSharedSpace) => {
    setSelectedSharedspace(sharedSpace);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const headLabels = isTablet
    ? [
        { id: 'nameCode', label: t('sharedspace.name.code') },
        { id: '', label: '' },
      ]
    : [
        { id: 'nameCode', label: t('sharedspace.name.code') },
        { id: 'nameEn', label: t('sharedspace.name.en') },
        { id: 'nameJp', label: t('sharedspace.name.jp') },
        {
          id: 'descriptionEn',
          label: t('sharedspace.description.en'),
        },
        {
          id: 'descriptionJp',
          label: t('sharedspace.description.jp'),
        },
        {
          id: 'startDayTime',
          label: t('sharedspace.start.day.time'),
        },
        {
          id: 'endDayTime',
          label: t('sharedspace.end.day.time'),
        },
        {
          id: 'maxBookingHours',
          label: t('sharedspace.max.booking.hours'),
        },
        {
          id: 'maxBookingByUser',
          label: t('sharedspace.max.booking.by.user'),
        },
        { id: '', label: '' },
      ];

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          {t('sharedspaces.settings')}
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            setSelectedSharedspace(null);
            setOpenModal(true);
          }}
        >
          {t('new.sharedspace')}
        </Button>
      </Box>

      <Card>
        <CustomTableToolbar
          numSelected={table.selected.length}
          filter={filterNameCode}
          onFilter={(event) => {
            setFilterNameCode(event.target.value);
            table.onResetPage();
          }}
          onDeleteSelected={() => deleteRows(table.selected ?? [])}
        />

        <SimpleBarWrapper>
          <TableContainer>
            <SimpleBar autoHide={true}>
              <Table
                sx={{
                  tableLayout: 'fixed',
                  width: '100%',
                  borderCollapse: 'collapse',
                  '& td, & th': {
                    wordBreak: 'break-word',
                  },
                }}
              >
                <CustomTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={tableSharedSpaces.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableSharedSpaces.map(
                        (sharedSpace) => sharedSpace.nameCode
                      )
                    )
                  }
                  headLabel={headLabels}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <SharedspaceTableRow
                        key={row.nameCode}
                        row={row}
                        minimizeMode={isTablet}
                        selected={table.selected.includes(row.nameCode)}
                        onSelectRow={() => table.onSelectRow(row.nameCode)}
                        onEditRow={(sharedSpace) =>
                          handleOpenModal(sharedSpace)
                        }
                        onDeleteRow={(nameCode) => deleteRows([nameCode])}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableSharedSpaces.length
                    )}
                  />

                  {notFound && <TableNoData searchQuery={filterNameCode} />}
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
          count={tableSharedSpaces.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <SharedspaceEditModal
        open={openModal}
        onClose={handleCloseModal}
        sharedspace={selectedSharedspace}
        onSharedspaceUpdated={(sharedspaceProps, nameCode) =>
          updateSharedspaceFromList(sharedspaceProps, nameCode)
        }
        onSharedspaceCreated={(sharedspaceProps) =>
          addSharedspaceInList(sharedspaceProps)
        }
      />
    </DashboardContent>
  );
}

function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('nameCode');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
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
    (checked: boolean, newSelecteds: string[]) => {
      setSelected(checked ? newSelecteds : []);
    },
    []
  );

  const onSelectRow = useCallback((nameCode: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(nameCode)
        ? prevSelected.filter((item) => item !== nameCode)
        : [...prevSelected, nameCode]
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

export default Sharedspace;
