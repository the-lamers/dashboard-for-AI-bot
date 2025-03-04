import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

interface MetricModalProps {
  open: boolean;
  handleClose: () => void;
}

const MetricModal: React.FC<MetricModalProps> = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={modalStyle}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Мониторинг галлюцинаций
        </Typography>
        <Typography variant="body1">
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
