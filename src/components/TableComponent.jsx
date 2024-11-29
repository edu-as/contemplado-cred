import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TableComponent = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Conecta ao servidor WebSocket
    const socket = new WebSocket('ws://localhost:8080');

    // Recebe dados do servidor
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setTableData(newData);
    };

    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    // Fecha a conexão quando o componente for desmontado
    return () => socket.close();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Código</strong></TableCell>
            <TableCell><strong>Crédito</strong></TableCell>
            <TableCell><strong>Entrada</strong></TableCell>
            <TableCell><strong>Parcelas</strong></TableCell>
            <TableCell><strong>Fornecedor</strong></TableCell>
            <TableCell><strong>Contato</strong></TableCell>
            {/* Adicione mais cabeçalhos conforme necessário */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  {
                    // Verifica se o conteúdo é uma URL de imagem
                    cell.startsWith('http') && (cell.endsWith('.png') || cell.endsWith('.jpg') || cell.endsWith('.jpeg')) ? (
                      <img
                        src={cell}
                        alt={`Imagem ${cellIndex}`}
                        style={{
                          maxWidth: '50px',
                          maxHeight: '50px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          borderRadius: '4px' // Opcional: ajusta as bordas das imagens
                        }}
                      />
                    ) : (
                      cell
                    )
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
