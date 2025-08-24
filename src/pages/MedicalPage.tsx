import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  PictureAsPdf as PdfIcon,
  TableView as CsvIcon,
  Code as JsonIcon,
  Description as SummaryIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as ReportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EPCRData } from '../types/epcr';
import { exportToPDF, exportSingleRecordToCSV, exportSingleRecordToJSON, exportPatientSummary, exportToCSV } from '../utils/exportUtils';
import { recordService } from '../services/recordService';


export const MedicalPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<EPCRData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'completed' | 'submitted'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // Load records from service
  const loadRecords = async () => {
    setLoading(true);
    try {
      const allRecords = await recordService.getAllRecords();
      setRecords(allRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load records on mount and listen for updates
  useEffect(() => {
    loadRecords();
    
    // Listen for record updates from other parts of the app
    const handleRecordsUpdate = () => {
      loadRecords();
    };
    
    window.addEventListener('epcr-records-updated', handleRecordsUpdate);
    
    return () => {
      window.removeEventListener('epcr-records-updated', handleRecordsUpdate);
    };
  }, []);

  // Filter records based on search and status
  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchTerm || 
      record.reportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientDemographics?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientDemographics?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.medicalHistory?.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, recordId: string) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedRecord(recordId);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedRecord(null);
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setExportMenuAnchor(event.currentTarget);
    handleActionMenuClose();
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleViewRecord = (recordId: string) => {
    navigate(`/epcr/${recordId}`);
    handleActionMenuClose();
  };

  const handleEditRecord = (recordId: string) => {
    navigate(`/epcr/${recordId}/edit`);
    handleActionMenuClose();
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecordToDelete(recordId);
    setDeleteDialogOpen(true);
    handleActionMenuClose();
  };

  const handleConfirmDelete = async () => {
    if (recordToDelete) {
      try {
        await recordService.deleteRecord(recordToDelete);
        setRecords(records.filter(record => record.id !== recordToDelete));
      } catch (error) {
        console.error('Error deleting record:', error);
        // You could add error handling UI here
      }
    }
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const handlePrintRecord = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      await exportToPDF(record);
    }
    handleActionMenuClose();
  };

  const handleExportRecord = (recordId: string) => {
    setSelectedRecord(recordId);
    handleActionMenuClose();
  };

  const handleExportToPDF = async () => {
    if (selectedRecord) {
      const record = records.find(r => r.id === selectedRecord);
      if (record) {
        await exportToPDF(record);
      }
    }
    handleExportMenuClose();
  };

  const handleExportToCSV = () => {
    if (selectedRecord) {
      const record = records.find(r => r.id === selectedRecord);
      if (record) {
        exportSingleRecordToCSV(record);
      }
    }
    handleExportMenuClose();
  };

  const handleExportToJSON = () => {
    if (selectedRecord) {
      const record = records.find(r => r.id === selectedRecord);
      if (record) {
        exportSingleRecordToJSON(record);
      }
    }
    handleExportMenuClose();
  };

  const handleExportSummary = () => {
    if (selectedRecord) {
      const record = records.find(r => r.id === selectedRecord);
      if (record) {
        exportPatientSummary(record);
      }
    }
    handleExportMenuClose();
  };

  const handleBulkExport = () => {
    exportToCSV(filteredRecords, `epcr_dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      draft: { color: 'warning' as const, label: 'Draft' },
      completed: { color: 'success' as const, label: 'Completed' },
      submitted: { color: 'primary' as const, label: 'Submitted' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default' as const, label: status };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPatientName = (demographics: any) => {
    if (!demographics?.firstName && !demographics?.lastName) return 'Unknown Patient';
    return `${demographics?.firstName || ''} ${demographics?.lastName || ''}`.trim();
  };

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4, 
        p: 4, 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        borderRadius: 3,
        color: 'white',
        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              color: 'white',
              fontWeight: 700,
              mb: 1
            }}>
              <img 
                src="/sfd-logo.png" 
                alt="Sacramento Fire CERT Logo"
                style={{ 
                  width: '60px', 
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  padding: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              Patient Care Records Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
              Sacramento Fire CERT - Sacramento Fire Department
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
              Manage and review electronic patient care reports for emergency response incidents
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          minWidth: 220,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)'
          },
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: '#3b82f6',
              color: 'white'
            }}>
              <ReportIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {records.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Reports
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          minWidth: 220,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)'
          },
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: '#10b981',
              color: 'white'
            }}>
              <PersonIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {records.filter(r => r.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Completed
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ 
          p: 3, 
          flex: 1, 
          minWidth: 220,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)'
          },
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: '#f59e0b',
              color: 'white'
            }}>
              <CalendarIcon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {records.filter(r => r.status === 'draft').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Drafts
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Main Table */}
      <Paper sx={{ 
        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)'
      }}>
        {/* Toolbar */}
        <Toolbar sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <TextField
              size="small"
              placeholder="Search reports, patients, or chief complaints..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleBulkExport}
              disabled={filteredRecords.length === 0}
            >
              Export All
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/epcr/new')}
            >
              New Report
            </Button>
          </Box>
        </Toolbar>

        {/* Table */}
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Report #</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chief Complaint</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date/Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>GCS</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Modified</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: 100 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No records found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Create your first report to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => record.id && handleViewRecord(record.id)}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {record.reportNumber || `#${record.id}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {getPatientName(record.patientDemographics)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.patientDemographics?.age ? `Age ${record.patientDemographics.age}` : ''}
                          {record.patientDemographics?.gender ? ` • ${record.patientDemographics.gender}` : ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.medicalHistory?.chiefComplaint || 'Not specified'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Medical
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.incidentInformation?.date} {record.incidentInformation?.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {record.glasgowComaScale?.total ? (
                        <Chip
                          label={`GCS ${record.glasgowComaScale.total}`}
                          color={
                            record.glasgowComaScale.total >= 13 ? 'success' :
                            record.glasgowComaScale.total >= 9 ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>{getStatusChip(record.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.updatedAt ? formatDate(record.updatedAt) : 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => record.id && handleActionMenuOpen(e, record.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
      >
        <MenuItem onClick={() => selectedRecord && handleViewRecord(selectedRecord)}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem onClick={() => selectedRecord && handleEditRecord(selectedRecord)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedRecord && handlePrintRecord(selectedRecord)}>
          <PrintIcon fontSize="small" sx={{ mr: 1 }} />
          Print
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleExportMenuOpen(e);
        }}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Export Options
        </MenuItem>
        <MenuItem 
          onClick={() => selectedRecord && handleDeleteRecord(selectedRecord)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this report? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Options Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
        onClick={handleExportMenuClose}
      >
        <MenuItem onClick={handleExportToPDF}>
          <PdfIcon fontSize="small" sx={{ mr: 1, color: '#d32f2f' }} />
          Export as PDF
        </MenuItem>
        <MenuItem onClick={handleExportToCSV}>
          <CsvIcon fontSize="small" sx={{ mr: 1, color: '#2e7d32' }} />
          Export as CSV
        </MenuItem>
        <MenuItem onClick={handleExportToJSON}>
          <JsonIcon fontSize="small" sx={{ mr: 1, color: '#1976d2' }} />
          Export as JSON
        </MenuItem>
        <MenuItem onClick={handleExportSummary}>
          <SummaryIcon fontSize="small" sx={{ mr: 1, color: '#f57c00' }} />
          Patient Summary
        </MenuItem>
      </Menu>
    </Container>
  );
};