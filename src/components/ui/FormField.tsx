import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Box,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface BaseFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: string;
}

interface TextFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time';
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'select';
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'checkbox';
}

interface RadioFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'radio';
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  row?: boolean;
}

interface DateTimeFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'datetime';
  minDate?: Date;
  maxDate?: Date;
}

type FormFieldProps<T extends FieldValues> = 
  | TextFieldProps<T>
  | SelectFieldProps<T>
  | CheckboxFieldProps<T>
  | RadioFieldProps<T>
  | DateTimeFieldProps<T>;

export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  const { name, control, label, required = false, disabled = false, fullWidth = true, helperText } = props;

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={props.type}
                label={label}
                required={required}
                disabled={disabled}
                fullWidth={fullWidth}
                multiline={props.multiline}
                rows={props.rows}
                placeholder={props.placeholder}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || helperText}
                InputLabelProps={{
                  shrink: !!field.value,
                }}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth={fullWidth} error={!!fieldState.error} disabled={disabled}>
                <InputLabel required={required}>{label}</InputLabel>
                <Select
                  {...field}
                  label={label}
                  value={field.value || ''}
                >
                  {props.options.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      disabled={disabled}
                    />
                  }
                  label={label}
                />
                {fieldState.error && (
                  <FormHelperText error>{fieldState.error.message}</FormHelperText>
                )}
                {helperText && !fieldState.error && (
                  <FormHelperText>{helperText}</FormHelperText>
                )}
              </Box>
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} disabled={disabled}>
                <FormLabel required={required}>{label}</FormLabel>
                <RadioGroup
                  {...field}
                  row={props.row}
                  value={field.value || ''}
                >
                  {props.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      disabled={option.disabled}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText>{fieldState.error?.message || helperText}</FormHelperText>
              </FormControl>
            )}
          />
        );

      case 'datetime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <DateTimePicker
                  {...field}
                  label={label}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date?.toISOString())}
                  minDate={props.minDate}
                  maxDate={props.maxDate}
                  disabled={disabled}
                  slotProps={{
                    textField: {
                      required,
                      fullWidth,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message || helperText,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return renderField();
}