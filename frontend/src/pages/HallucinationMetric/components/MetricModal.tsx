import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

// Define the style for the modal with TypeScript type assertion
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

// Define the props interface with proper typing
interface MetricModalProps {
  open: boolean;
  handleClose: () => void;
}

/**
 * Modal component for displaying information about model hallucination monitoring
 * @param open - Boolean to control modal visibility
 * @param handleClose - Function to close the modal
 */
const MetricModal: React.FC<MetricModalProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={modalStyle}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          Мониторинг галлюцинаций
        </Typography>
        <Typography
          id="modal-description"
          variant="body1"
          sx={{ mb: 2 }}
        >
          Эта метрика отслеживает процент некорректных ответов модели (галлюцинаций) в онлайн-режиме. Расчёт производится с учетом сравнения с эталоном, анализа логической связности и эвристики ключевых слов.
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ mt: 2 }}
          variant="contained"
          color="secondary"
        >
          Закрыть
        </Button>
      </motion.div>
    </Modal>
  );
};

export default MetricModal;