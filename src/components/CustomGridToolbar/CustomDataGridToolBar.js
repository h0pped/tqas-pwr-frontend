import Box from '@mui/material/Box';
import { GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarFilterButton } from '@mui/x-data-grid';

const customDataGridToolbar = function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <GridToolbarQuickFilter />
        </Box>
        <Box>
          <GridToolbarExport />
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarFilterButton />
        </Box>
      </Box>
    </GridToolbarContainer>
  );
};

export default customDataGridToolbar;
