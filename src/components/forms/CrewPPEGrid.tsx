import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
} from '@mui/material';
import { Control, useController } from 'react-hook-form';
import { EPCRData } from '../../types/epcr';

interface CrewPPEGridProps {
  control: Control<EPCRData>;
}

const crewMembers = [
  { key: 'crewMemberA', label: 'A' },
  { key: 'crewMemberB', label: 'B' },
  { key: 'crewMemberC', label: 'C' },
  { key: 'crewMemberD', label: 'D' },
  { key: 'crewMemberE', label: 'E' },
] as const;

const ppeItems = [
  { key: 'gloves', label: 'Gloves' },
  { key: 'n95Mask', label: 'Mask' },
  { key: 'gown', label: 'Gown' },
  { key: 'eyeProtection', label: 'Eye' },
] as const;

export const CrewPPEGrid: React.FC<CrewPPEGridProps> = ({ control }) => {
  const PPECheckbox: React.FC<{
    crewMember: typeof crewMembers[number]['key'];
    ppeItem: typeof ppeItems[number]['key'];
  }> = ({ crewMember, ppeItem }) => {
    const { field } = useController({
      name: `crewPPE.${crewMember}.${ppeItem}`,
      control,
      defaultValue: false,
    });

    return (
      <Checkbox
        checked={field.value || false}
        onChange={(e) => field.onChange(e.target.checked)}
        size="small"
        sx={{
          p: 0.5,
          '&.Mui-checked': {
            color: 'primary.main',
          },
        }}
      />
    );
  };

  return (
    <Box className="crew-ppe-section" sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 'bold', mb: 1 }}>
        CREW MEMBER PPE
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #000' }}>
        <Table 
          size="small" 
          sx={{ 
            '& .MuiTableCell-root': { 
              border: '1px solid #000',
              padding: '4px',
              fontSize: '0.75rem',
              textAlign: 'center'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '60px', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                {/* Empty cell for crew member labels */}
              </TableCell>
              {ppeItems.map((ppe) => (
                <TableCell 
                  key={ppe.key} 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f5f5f5',
                    width: '60px'
                  }}
                >
                  {ppe.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {crewMembers.map((crew) => (
              <TableRow key={crew.key}>
                <TableCell 
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  {crew.label}
                </TableCell>
                {ppeItems.map((ppe) => (
                  <TableCell key={ppe.key}>
                    <PPECheckbox crewMember={crew.key} ppeItem={ppe.key} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};