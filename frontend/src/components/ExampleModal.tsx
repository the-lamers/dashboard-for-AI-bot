import React, { useState } from 'react';
import { Box, Backdrop, Button } from '@mui/material';
import { motion } from 'framer-motion';

const ExampleModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Открыть модал
      </Button>
      <Backdrop
        open={open}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <Box>Содержимое модального окна</Box>
        </motion.div>
      </Backdrop>
    </>
  );
};

export default ExampleModal;
