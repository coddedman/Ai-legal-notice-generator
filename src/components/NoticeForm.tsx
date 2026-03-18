'use client';

import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  RadioGroup,
  Radio,
  FormControlLabel,
  useTheme
} from '@mui/material';
import { Send as SendIcon, ArrowRight, ArrowLeft, Wand2, Info, Paperclip, FileCheck } from 'lucide-react';

const ISSUE_TYPES = [
  'Fraud',
  'Service Delay',
  'Refund Not Given',
  'Contract Breach',
  'Custom Issue',
];

export interface NoticeFormData {
  senderType: 'self' | 'lawyer';
  lawyerName?: string;
  issueType: string;
  senderName: string;
  receiverName: string;
  serviceDetails: string;
  amount: string;
  paymentDate: string;
  deliveryDate: string;
  description: string;
  evidenceText?: string;
}

interface Props {
  onSubmit: (data: NoticeFormData) => void;
  loading: boolean;
}

const steps = ['Dispute Details', 'Reference Evidence', 'Financials & Dates', 'Party Information'];

export default function NoticeForm({ onSubmit, loading }: Props) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NoticeFormData>({
    defaultValues: {
      senderType: 'self',
      lawyerName: '',
      issueType: '',
      senderName: '',
      receiverName: '',
      serviceDetails: '',
      amount: '',
      paymentDate: '',
      deliveryDate: '',
      description: '',
      evidenceText: '',
    },
    mode: 'onTouched'
  });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setValue('evidenceText', text);
      setUploading(false);
    };
    reader.readAsText(file);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof NoticeFormData)[] = [];
    if (activeStep === 0) {
      fieldsToValidate = ['issueType', 'serviceDetails', 'description'];
    } else if (activeStep === 2) {
      fieldsToValidate = ['amount', 'paymentDate', 'deliveryDate'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const currentSenderType = watch('senderType');

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const fillDemoData = () => {
    setValue('senderType', 'self', { shouldValidate: true });
    setValue('issueType', 'Service Delay', { shouldValidate: true });
    setValue('serviceDetails', 'Wedding Photography and Videography', { shouldValidate: true });
    setValue('description', 'The photographer took the advance but did not show up on the wedding day. Phone is switched off.', { shouldValidate: true });
    setValue('amount', '50000', { shouldValidate: true });
    setValue('paymentDate', '2025-10-01', { shouldValidate: true });
    setValue('deliveryDate', '2025-11-15', { shouldValidate: true });
    setValue('senderName', 'Rahul Verma', { shouldValidate: true });
    setValue('receiverName', 'DreamShot Studio Pvt Ltd', { shouldValidate: true });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ flexGrow: 1, '& .MuiStepLabel-label': { mt: 1 } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && (
           <Tooltip title="Auto-fill with demo data to test the AI">
             <Button 
               variant="outlined" 
               size="small" 
               color="secondary"
               startIcon={<Wand2 size={16} />}
               onClick={fillDemoData}
               disabled={loading}
               sx={{ ml: 2, borderRadius: 2, textTransform: 'none', minWidth: '140px' }}
             >
               Try Demo Data
             </Button>
           </Tooltip>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* STEP 0: Dispute Details */}
        {activeStep === 0 && (
          <Box className="animate-fade-in" display="flex" flexDirection="column" gap={3}>
            <Controller
              name="issueType"
              control={control}
              rules={{ required: 'Please select an issue type' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.issueType} disabled={loading}>
                  <InputLabel id="issue-type-label">Issue Type *</InputLabel>
                  <Select labelId="issue-type-label" label="Issue Type *" {...field}>
                    {ISSUE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {errors.issueType && <Typography variant="caption" color="error" mt={0.5}>{errors.issueType.message}</Typography>}
                </FormControl>
              )}
            />

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
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Issue Description (What went wrong?) *"
                  placeholder="Explain exactly what happened, and why you are sending this notice."
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={loading}
                />
              )}
            />
          </Box>
        )}

        {/* STEP 1: Reference Evidence */}
        {activeStep === 1 && (
          <Box className="animate-fade-in" display="flex" flexDirection="column" gap={3}>
            <Box p={3} border="2px dashed" borderColor="divider" borderRadius={3} textAlign="center" bgcolor="rgba(99, 102, 241, 0.02)">
              <Paperclip size={32} color={theme.palette.text.secondary} style={{ marginBottom: 12, opacity: 0.5 }} />
              <Typography variant="h6" fontWeight={600} mb={1}>Upload Reference Evidence</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Upload a WhatsApp chat export (.txt), email thread, or any document. 
                Our AI will analyze the facts to make your notice more accurate.
              </Typography>
              
              <input
                accept=".txt,.csv,.json,.md,.html"
                style={{ display: 'none' }}
                id="evidence-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="evidence-upload">
                <Button variant="outlined" component="span" disabled={loading || uploading} startIcon={uploading ? <Wand2 className="animate-spin" size={18} /> : <Paperclip size={18} />}>
                  {uploading ? 'Analyzing File...' : 'Attach Reference File'}
                </Button>
              </label>
              
              {watch('evidenceText') && (
                <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1} color="success.main">
                  <FileCheck size={18} />
                  <Typography variant="caption" fontWeight={600}>Evidence Analyzed Successfully ({watch('evidenceText')?.length} chars)</Typography>
                </Box>
              )}
            </Box>

            <Controller
              name="evidenceText"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Additional Evidence Summary (Optional)"
                  placeholder="Or paste transaction IDs, specific dates, or copy-pasted chat snippets here..."
                  multiline
                  rows={3}
                  disabled={loading}
                  helperText="This helps the AI cite specific facts and promises made by the opposite party."
                />
              )}
            />
          </Box>
        )}

        {/* STEP 2: Financials */}
        {activeStep === 2 && (
          <Box className="animate-fade-in" display="flex" flexDirection="column" gap={3}>
            <Controller
              name="amount"
              control={control}
              rules={{ required: 'Amount is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Payment Amount *"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  disabled={loading}
                />
              )}
            />
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3}>
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* STEP 3: Party Details */}
        {activeStep === 3 && (
          <Box className="animate-fade-in" display="flex" flexDirection="column" gap={3}>
            <Box display="flex" alignItems="center" bgcolor="rgba(99, 102, 241, 0.1)" p={2} borderRadius={2} mb={1}>
               <Info size={20} color="#6366f1" style={{ marginRight: 8 }} />
               <Typography variant="body2" color="text.primary">
                 Your details are completely secure and used strictly to generate the drafts.
               </Typography>
            </Box>
            
            <Box bgcolor="background.paper" p={2} borderRadius={2} border="1px solid" borderColor="divider">
              <Controller
                name="senderType"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" disabled={loading}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>Who is drafting this Notice?</Typography>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="self" control={<Radio size="small" />} label="I am the client (Drafting myself)" />
                      <FormControlLabel value="lawyer" control={<Radio size="small" />} label="I am a Lawyer (Drafting for my client)" />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Box>
            
            {currentSenderType === 'lawyer' && (
              <Box className="animate-fade-in">
                <Controller
                  name="lawyerName"
                  control={control}
                  rules={{ required: 'Lawyer Name is required if you are drafting for a client' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Advocate / Lawyer Name *"
                      placeholder="e.g. Adv. R.K. Sharma"
                      error={!!errors.lawyerName}
                      helperText={errors.lawyerName?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Box>
            )}

            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3}>
              <Box flex={1}>
                <Controller
                  name="senderName"
                  control={control}
                  rules={{ required: currentSenderType === 'lawyer' ? 'Client Name is required' : 'Sender Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={currentSenderType === 'lawyer' ? "Client's Full Name *" : "Your Full Name *"}
                      error={!!errors.senderName}
                      helperText={errors.senderName?.message}
                      disabled={loading}
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
                      disabled={loading}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            startIcon={<ArrowLeft size={18} />}
            sx={{ textTransform: 'none', px: 3 }}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              endIcon={<SendIcon size={18} />}
              sx={{
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              {loading ? 'Drafting...' : 'Generate Legal Notice'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={<ArrowRight size={18} />}
              sx={{ px: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Continue
            </Button>
          )}
        </Box>

      </Box>
    </Box>
  );
}
