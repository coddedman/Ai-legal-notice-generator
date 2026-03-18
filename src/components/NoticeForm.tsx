'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
} from '@mui/material';
import { Send as SendIcon } from 'lucide-react';

const ISSUE_TYPES = [
  'Fraud',
  'Service Delay',
  'Refund Not Given',
  'Contract Breach',
  'Custom Issue',
];

export interface NoticeFormData {
  issueType: string;
  senderName: string;
  receiverName: string;
  serviceDetails: string;
  amount: string;
  paymentDate: string;
  deliveryDate: string;
  description: string;
}

interface Props {
  onSubmit: (data: NoticeFormData) => void;
  loading: boolean;
}

export default function NoticeForm({ onSubmit, loading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeFormData>({
    defaultValues: {
      issueType: '',
      senderName: '',
      receiverName: '',
      serviceDetails: '',
      amount: '',
      paymentDate: '',
      deliveryDate: '',
      description: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Controller
          name="issueType"
          control={control}
          rules={{ required: 'Please select an issue type' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.issueType}>
              <InputLabel id="issue-type-label">Issue Type *</InputLabel>
              <Select
                labelId="issue-type-label"
                label="Issue Type *"
                {...field}
              >
                {ISSUE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3}>
        <Box flex={1}>
          <Controller
            name="senderName"
            control={control}
            rules={{ required: 'Sender Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Sender Name (Your Name) *"
                error={!!errors.senderName}
                helperText={errors.senderName?.message}
              />
            )}
          />
        </Box>
        <Box flex={1}>
          <Controller
            name="receiverName"
            control={control}
            rules={{ required: 'Receiver Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Receiver Name (Vendor/Company) *"
                error={!!errors.receiverName}
                helperText={errors.receiverName?.message}
              />
            )}
          />
        </Box>
      </Box>

      <Box>
        <Controller
          name="serviceDetails"
          control={control}
          rules={{ required: 'Service/Product Details are required' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Service or Product Details *"
              placeholder="e.g. Wedding Photography Services, Laptop Repair"
              error={!!errors.serviceDetails}
              helperText={errors.serviceDetails?.message}
            />
          )}
        />
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3}>
        <Box flex={1}>
          <Controller
            name="amount"
            control={control}
            rules={{ required: 'Amount is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Payment Amount (₹) *"
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />
        </Box>
        <Box flex={1}>
          <Controller
            name="paymentDate"
            control={control}
            rules={{ required: 'Payment Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Payment Date *"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.paymentDate}
                helperText={errors.paymentDate?.message}
              />
            )}
          />
        </Box>
        <Box flex={1}>
          <Controller
            name="deliveryDate"
            control={control}
            rules={{ required: 'Agreed Delivery Date is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Agreed Delivery Date *"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.deliveryDate}
                helperText={errors.deliveryDate?.message}
              />
            )}
          />
        </Box>
      </Box>

      <Box>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Issue Description (What went wrong?) *"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />
      </Box>

      <Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          endIcon={<SendIcon size={20} />}
          sx={{
            py: 2,
            mt: 2,
            borderRadius: 3,
            fontSize: '1.1rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 2,
            background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5)',
            }
          }}
        >
          {loading ? 'Drafting Notice...' : 'Generate Legal Notice'}
        </Button>
      </Box>
    </Box>
  );
}
