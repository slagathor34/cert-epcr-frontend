import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  LocalHospital as MedicalIcon,
  Security as SecurityIcon,
  Group as TeamIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Member, CertificationRecord } from '../../types/member';
import memberService, { MemberService } from '../../services/memberService';

interface CertificationTrackerProps {
  member: Member;
  onUpdate?: () => void;
  readOnly?: boolean;
}

interface CertificationEditDialog {
  open: boolean;
  certType: string;
  certName: string;
  certification: CertificationRecord | any;
}

const CertificationTracker: React.FC<CertificationTrackerProps> = ({
  member,
  onUpdate,
  readOnly = false
}) => {
  const [editDialog, setEditDialog] = useState<CertificationEditDialog>({
    open: false,
    certType: '',
    certName: '',
    certification: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditCertification = (certType: string, certName: string, certification: any) => {
    setEditDialog({
      open: true,
      certType,
      certName,
      certification: { ...certification }
    });
  };

  const handleSaveCertification = async () => {
    if (!editDialog.certification || !member) return;

    setLoading(true);
    setError(null);

    try {
      await memberService.updateCertification(
        member._id,
        editDialog.certType,
        {
          certification: editDialog.certName,
          isCompleted: editDialog.certification.isCompleted,
          dateCompleted: editDialog.certification.dateCompleted
        }
      );

      setEditDialog({ open: false, certType: '', certName: '', certification: null });
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update certification');
    } finally {
      setLoading(false);
    }
  };

  const getCertificationIcon = (certification: any) => {
    if (!certification?.isCompleted) {
      return <CancelIcon color="error" />;
    }

    const expirationDate = certification.expirationDate || certification.lastCompleted;
    if (expirationDate) {
      if (MemberService.isCertificationExpired(expirationDate)) {
        return <WarningIcon color="error" />;
      }
      if (MemberService.isCertificationExpiringSoon(expirationDate)) {
        return <WarningIcon color="warning" />;
      }
    }

    return <CheckIcon color="success" />;
  };

  const getCertificationStatus = (certification: any) => {
    if (!certification?.isCompleted) {
      return { label: 'Not Completed', color: 'error' };
    }

    const expirationDate = certification.expirationDate || certification.lastCompleted;
    if (expirationDate) {
      if (MemberService.isCertificationExpired(expirationDate)) {
        return { label: 'Expired', color: 'error' };
      }
      if (MemberService.isCertificationExpiringSoon(expirationDate)) {
        return { label: 'Expires Soon', color: 'warning' };
      }
    }

    return { label: 'Current', color: 'success' };
  };

  const formatCertificationName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/\bis\b/gi, 'IS-')
      .replace(/\bics\b/gi, 'ICS-')
      .replace(/\bg\b/gi, 'G-')
      .trim();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = (certifications: any) => {
    if (!certifications || typeof certifications !== 'object') return 0;
    
    const entries = Object.entries(certifications);
    if (entries.length === 0) return 0;
    
    const completed = entries.filter(([_, cert]: [string, any]) => cert?.isCompleted).length;
    return Math.round((completed / entries.length) * 100);
  };

  const renderCertificationGroup = (
    title: string,
    certifications: any,
    icon: React.ReactNode,
    certType: string,
    color: string = 'primary'
  ) => {
    if (!certifications || typeof certifications !== 'object') return null;

    const progress = calculateProgress(certifications);

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              {icon}
              <Typography variant="h6">{title}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="textSecondary">
                {progress}% Complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: 100 }}
                color={progress >= 80 ? 'success' : progress >= 50 ? 'warning' : 'error'}
              />
            </Box>
          </Box>

          <List dense>
            {Object.entries(certifications).map(([key, certification]: [string, any]) => {
              if (typeof certification !== 'object' || certification === null) return null;

              const status = getCertificationStatus(certification);
              const displayName = formatCertificationName(key);

              return (
                <ListItem key={key} divider>
                  <ListItemIcon>
                    {getCertificationIcon(certification)}
                  </ListItemIcon>
                  <ListItemText
                    primary={displayName}
                    secondary={
                      <Box>
                        {certification.dateCompleted && (
                          <Typography variant="caption" display="block">
                            Completed: {formatDate(certification.dateCompleted)}
                          </Typography>
                        )}
                        {certification.expirationDate && (
                          <Typography variant="caption" display="block">
                            Expires: {formatDate(certification.expirationDate)}
                          </Typography>
                        )}
                        {certification.lastCompleted && (
                          <Typography variant="caption" display="block">
                            Last: {formatDate(certification.lastCompleted)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={status.label}
                        color={status.color as any}
                        size="small"
                      />
                      {!readOnly && (
                        <Tooltip title="Edit Certification">
                          <IconButton
                            size="small"
                            onClick={() => handleEditCertification(certType, key, certification)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderNestedCertificationGroup = (
    title: string,
    certificationGroups: any,
    icon: React.ReactNode,
    certType: string
  ) => {
    if (!certificationGroups || typeof certificationGroups !== 'object') return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>

          {Object.entries(certificationGroups).map(([groupKey, groupCerts]: [string, any]) => {
            if (typeof groupCerts !== 'object' || groupCerts === null) return null;
            
            const progress = calculateProgress(groupCerts);
            const groupTitle = groupKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

            return (
              <Box key={groupKey} sx={{ mb: 3, ml: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="between" mb={1}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {groupTitle}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body2" color="textSecondary">
                      {progress}% Complete
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ width: 80 }}
                      color={progress >= 80 ? 'success' : progress >= 50 ? 'warning' : 'error'}
                    />
                  </Box>
                </Box>

                <List dense sx={{ pl: 2 }}>
                  {Object.entries(groupCerts).map(([certKey, certification]: [string, any]) => {
                    if (typeof certification !== 'object' || certification === null) return null;

                    const status = getCertificationStatus(certification);
                    const displayName = formatCertificationName(certKey);

                    return (
                      <ListItem key={certKey} divider sx={{ pl: 1 }}>
                        <ListItemIcon>
                          {getCertificationIcon(certification)}
                        </ListItemIcon>
                        <ListItemText
                          primary={displayName}
                          secondary={
                            certification.dateCompleted && 
                            `Completed: ${formatDate(certification.dateCompleted)}`
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={status.label}
                              color={status.color as any}
                              size="small"
                            />
                            {!readOnly && (
                              <Tooltip title="Edit Certification">
                                <IconButton
                                  size="small"
                                  onClick={() => 
                                    handleEditCertification(`${certType}${groupKey}`, certKey, certification)
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* FEMA CERT Type 2 */}
      {renderCertificationGroup(
        'FEMA CERT Volunteer Type 2',
        member.femaCertType2,
        <SchoolIcon sx={{ color: '#1976d2' }} />,
        'type2'
      )}

      {/* FEMA CERT Type 1 Plus */}
      {renderCertificationGroup(
        'FEMA CERT Volunteer Type 1 Plus',
        member.femaCertType1Plus,
        <SecurityIcon sx={{ color: '#d32f2f' }} />,
        'type1plus'
      )}

      {/* Section Chief */}
      {renderCertificationGroup(
        'FEMA CERT Section Chief',
        member.femaSectionChief,
        <TeamIcon sx={{ color: '#f57c00' }} />,
        'sectionchief'
      )}

      {/* Team Leader (nested structure) */}
      {renderNestedCertificationGroup(
        'FEMA CERT Team Leader',
        member.femaTeamLeader,
        <TeamIcon sx={{ color: '#1976d2' }} />,
        'teamleader'
      )}

      {/* Emergency Medical Responder */}
      {renderCertificationGroup(
        'Emergency Medical Responder',
        member.emergencyMedicalResponder,
        <MedicalIcon sx={{ color: '#d32f2f' }} />,
        'emr'
      )}

      {/* Instructor */}
      {renderCertificationGroup(
        'Instructor Certifications',
        member.instructor,
        <SchoolIcon sx={{ color: '#f57c00' }} />,
        'instructor'
      )}

      {/* Edit Certification Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, certType: '', certName: '', certification: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Certification: {formatCertificationName(editDialog.certName)}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editDialog.certification?.isCompleted || false}
                    onChange={(e) =>
                      setEditDialog({
                        ...editDialog,
                        certification: {
                          ...editDialog.certification,
                          isCompleted: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Completed"
              />
            </Grid>
            
            {editDialog.certification?.isCompleted && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date Completed"
                  type="date"
                  value={
                    editDialog.certification.dateCompleted
                      ? new Date(editDialog.certification.dateCompleted).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditDialog({
                      ...editDialog,
                      certification: {
                        ...editDialog.certification,
                        dateCompleted: e.target.value ? new Date(e.target.value).toISOString() : null,
                      },
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}

            {/* Show expiration date field for medical certifications */}
            {(editDialog.certType === 'emr' && 
              ['bls', 'emr', 'covid19'].includes(editDialog.certName)) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expiration Date"
                  type="date"
                  value={
                    editDialog.certification?.expirationDate
                      ? new Date(editDialog.certification.expirationDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditDialog({
                      ...editDialog,
                      certification: {
                        ...editDialog.certification,
                        expirationDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                      },
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialog({ open: false, certType: '', certName: '', certification: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCertification}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificationTracker;