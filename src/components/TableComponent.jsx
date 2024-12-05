import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TableComponent = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Conecta ao servidor WebSocket
    const socket = new WebSocket('ws://localhost:8081');

    // Recebe dados do servidor
    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      // Filtra linhas que tenham exatamente 6 colunas (evita quebra de layout) e remove colunas vazias
      const filteredData = newData.map(row => row.filter(cell => cell !== ''));

      setTableData(filteredData);
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
            <TableCell align="center"><strong>Código</strong></TableCell>
            <TableCell align="center"><strong>Crédito</strong></TableCell>
            <TableCell align="center"><strong>Entrada</strong></TableCell>
            <TableCell align="center"><strong>Parcelas</strong></TableCell>
            <TableCell align="center"><strong>Fornecedor</strong></TableCell>
            <TableCell align="center"><strong>Contato</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                cell !== '' && (
                  <TableCell key={cellIndex} align="center">
                    {
                      // Verifica se o conteúdo é uma URL de imagem
                      typeof cell === 'string' &&
                      (cell.startsWith('http') && (cell.endsWith('.png') || cell.endsWith('.jpg') || cell.endsWith('.jpeg'))) ? (
                        <img
                          src={cell}
                          alt={`Imagem ${cellIndex}`}
                          style={{
                            maxWidth: '50px',
                            maxHeight: '50px',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '4px' // Ajusta as bordas das imagens
                          }}
                        />
                      ) : (
                        cell // Exibe o valor normal da célula
                      )
                    }
                  </TableCell>
                )
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
