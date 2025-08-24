import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  IconButton,
  Avatar,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Radio as RadioIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  LocalHospital as MedicalIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Member, MemberFilters, MemberStatsResponse } from '../types/member';
import memberService, { MemberService } from '../services/memberService';

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalMembers, setTotalMembers] = useState(0);
  const [stats, setStats] = useState<MemberStatsResponse['data'] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editedMemberData, setEditedMemberData] = useState<Member | null>(null);
  const [showCertDialog, setShowCertDialog] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    status: '',
    certificationLevel: '',
    activeOnly: false,
    fieldReadyOnly: false,
    sortBy: 'lastName',
    sortOrder: 'asc',
  });

  // Load members and stats on component mount
  useEffect(() => {
    loadMembers();
    loadStats();
  }, [page, rowsPerPage, filters]);

  const loadMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await memberService.getMembers({
        ...filters,
        page: page + 1,
        limit: rowsPerPage,
      });
      
      setMembers(response.data);
      setTotalMembers(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await memberService.getMemberStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: event.target.value });
    setPage(0); // Reset to first page when searching
  };

  const handleFilterChange = (field: keyof MemberFilters, value: any) => {
    setFilters({ ...filters, [field]: value });
    setPage(0); // Reset to first page when filtering
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditCertifications = (member: Member) => {
    setEditingMember(member);
    setEditedMemberData(JSON.parse(JSON.stringify(member))); // Deep copy
    setShowCertDialog(true);
  };

  const updateCertification = (certPath: string, field: string, value: boolean) => {
    if (!editedMemberData) return;
    
    const updatedMember = { ...editedMemberData };
    const pathParts = certPath.split('.');
    
    // Navigate to the certification object
    let certObj = updatedMember as any;
    for (let i = 0; i < pathParts.length; i++) {
      if (i === pathParts.length - 1) {
        // Last part - update the field
        if (!certObj[pathParts[i]]) {
          certObj[pathParts[i]] = {};
        }
        certObj[pathParts[i]][field] = value;
        if (value) {
          certObj[pathParts[i]].dateCompleted = new Date().toISOString().split('T')[0];
        }
      } else {
        // Navigate deeper
        if (!certObj[pathParts[i]]) {
          certObj[pathParts[i]] = {};
        }
        certObj = certObj[pathParts[i]];
      }
    }
    
    setEditedMemberData(updatedMember);
  };

  const handleSaveCertifications = async () => {
    if (!editingMember || !editedMemberData) return;
    
    try {
      // TODO: Add API call to update certifications
      // await memberService.updateCertifications(editingMember._id, editedMemberData);
      console.log('Updated member data:', editedMemberData);
      setShowCertDialog(false);
      setEditingMember(null);
      setEditedMemberData(null);
      loadMembers(); // Refresh the list
    } catch (err) {
      console.error('Failed to update certifications:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Field Ready': return 'success';
      case 'Active': return 'info';
      case 'In Training': return 'warning';
      case 'Suspended': return 'error';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCertificationDisplay = (member: Member) => {
    const summary = member.certificationSummary;
    if (!summary) return 'N/A';
    
    const percentage = summary.femaCertType2.percentage;
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1}
        sx={{ cursor: 'pointer' }}
        onClick={() => handleEditCertifications(member)}
      >
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ width: 60, height: 6 }}
          color={percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
        />
        <Typography variant="body2">{percentage}%</Typography>
      </Box>
    );
  };

  const StatsCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color?: string }> = ({
    title,
    value,
    icon,
    color = 'primary'
  }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          CERT Member Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ 
            height: 'fit-content',
            backgroundColor: '#f59e0b',
            color: 'white',
            '&:hover': {
              backgroundColor: '#d97706'
            }
          }}
        >
          Dashboard
        </Button>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Total Members"
              value={stats.total}
              icon={<GroupIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Field Ready"
              value={stats.fieldReady}
              icon={<BadgeIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="EMR Certified"
              value={stats.emrCertified}
              icon={<MedicalIcon />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="Instructors"
              value={stats.instructors}
              icon={<SchoolIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <StatsCard
              title="New Members (30d)"
              value={stats.recentJoiners}
              icon={<CalendarIcon />}
              color="secondary"
            />
          </Grid>
        </Grid>
      )}

      {/* Search and Filter Toolbar */}
      <Card sx={{ mb: 3 }}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <TextField
              placeholder="Search members..."
              variant="outlined"
              size="small"
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 300 }}
            />
            
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Navigate to add member */}}
          >
            Add Member
          </Button>
        </Toolbar>

        {/* Expandable Filters */}
        {showFilters && (
          <CardContent sx={{ pt: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || ''}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Field Ready">Field Ready</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="In Training">In Training</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Certification Level</InputLabel>
                  <Select
                    value={filters.certificationLevel || ''}
                    label="Certification Level"
                    onChange={(e) => handleFilterChange('certificationLevel', e.target.value)}
                  >
                    <MenuItem value="">All Levels</MenuItem>
                    <MenuItem value="type2">CERT Type 2</MenuItem>
                    <MenuItem value="type1plus">CERT Type 1 Plus</MenuItem>
                    <MenuItem value="sectionchief">Section Chief</MenuItem>
                    <MenuItem value="teamleader">Team Leader</MenuItem>
                    <MenuItem value="emr">EMR Certified</MenuItem>
                    <MenuItem value="instructor">Instructor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy || 'lastName'}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <MenuItem value="lastName">Last Name</MenuItem>
                    <MenuItem value="firstName">First Name</MenuItem>
                    <MenuItem value="idNumber">ID Number</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="joinDate">Join Date</MenuItem>
                    <MenuItem value="totalHoursServed">Hours Served</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Members Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>ID Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Certifications</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box display="flex" justifyContent="center" p={3}>
                      <LinearProgress sx={{ width: '100%' }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box p={3}>
                      <Typography variant="body1" color="textSecondary">
                        No members found matching your criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {MemberService.formatMemberName(member)}
                          </Typography>
                          {member.fccLicense?.callsign && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <RadioIcon fontSize="small" color="primary" />
                              <Typography variant="body2" color="primary">
                                {member.fccLicense.callsign}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {member.idNumber}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={member.status}
                        color={getStatusColor(member.status) as any}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        {member.email && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <EmailIcon fontSize="small" color="disabled" />
                            <Typography variant="body2">{member.email}</Typography>
                          </Box>
                        )}
                        {member.phone && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon fontSize="small" color="disabled" />
                            <Typography variant="body2">
                              {MemberService.formatPhoneNumber(member.phone)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      {getCertificationDisplay(member)}
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {member.totalHoursServed || 0}h
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(member.joinDate)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/members/${member._id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Member">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/members/${member._id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalMembers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>

      {/* Certification Edit Dialog */}
      <Dialog open={showCertDialog} onClose={() => setShowCertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Certifications - {editingMember ? MemberService.formatMemberName(editingMember) : ''}
        </DialogTitle>
        <DialogContent>
          {editedMemberData && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>FEMA CERT Certifications</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>CERT Type 2 Basic</InputLabel>
                      <Select
                        value={editedMemberData.femaCertType2?.basicCert?.isCompleted ? 'completed' : 'not_completed'}
                        label="CERT Type 2 Basic"
                        onChange={(e) => {
                          updateCertification('femaCertType2.basicCert', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>IS-100</InputLabel>
                      <Select
                        value={editedMemberData.femaCertType2?.is100?.isCompleted ? 'completed' : 'not_completed'}
                        label="IS-100"
                        onChange={(e) => {
                          updateCertification('femaCertType2.is100', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>IS-200</InputLabel>
                      <Select
                        value={editedMemberData.femaCertType2?.is200?.isCompleted ? 'completed' : 'not_completed'}
                        label="IS-200"
                        onChange={(e) => {
                          updateCertification('femaCertType2.is200', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>IS-700</InputLabel>
                      <Select
                        value={editedMemberData.femaCertType2?.is700?.isCompleted ? 'completed' : 'not_completed'}
                        label="IS-700"
                        onChange={(e) => {
                          updateCertification('femaCertType2.is700', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Emergency Medical Response</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>EMR Certification</InputLabel>
                      <Select
                        value={editedMemberData.emergencyMedicalResponder?.emr?.isCompleted ? 'completed' : 'not_completed'}
                        label="EMR Certification"
                        onChange={(e) => {
                          updateCertification('emergencyMedicalResponder.emr', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>BLS Certification</InputLabel>
                      <Select
                        value={editedMemberData.emergencyMedicalResponder?.bls?.isCompleted ? 'completed' : 'not_completed'}
                        label="BLS Certification"
                        onChange={(e) => {
                          updateCertification('emergencyMedicalResponder.bls', 'isCompleted', e.target.value === 'completed');
                        }}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not_completed">Not Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info">
                  Certification updates will recalculate member progress and field readiness status.
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowCertDialog(false);
            setEditingMember(null);
            setEditedMemberData(null);
          }}>Cancel</Button>
          <Button onClick={handleSaveCertifications} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberManagement;