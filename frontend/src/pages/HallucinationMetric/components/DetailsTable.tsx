import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

interface Detail {
  parameter: string;
  value: number;
  comment: string;
}

interface DetailsTableProps {
  details: Detail[];
}

const DetailsTable: React.FC<DetailsTableProps> = ({ details }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 2, background: "rgba(255,255,255,0.05)" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Параметр</TableCell>
            <TableCell>Значение</TableCell>
            <TableCell>Комментарий</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.parameter}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell>{row.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DetailsTable;
