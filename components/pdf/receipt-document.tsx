// @ts-nocheck
"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definimos estilos
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'column',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoSubtext: {
    fontSize: 10,
    color: '#666',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  label: {
    fontSize: 8,
    color: '#888',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  colDesc: { width: '50%' },
  colIMEI: { width: '30%' },
  colPrice: { width: '20%', textAlign: 'right' },
  
  totalSection: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalContainer: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  warranty: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  warrantyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  warrantyText: {
    fontSize: 8,
    color: '#0c4a6e',
    textAlign: 'justify',
  }
});

// Interfaz flexible para evitar conflictos
interface ReceiptProps {
  venta: any; 
}

export const ReceiptDocument = ({ venta }: ReceiptProps) => {
  // Safe guards para evitar errores de renderizado si faltan datos
  const fecha = venta.createdAt ? new Date(venta.createdAt) : new Date();
  const idVenta = venta.id ? venta.id.slice(-6).toUpperCase() : "0000";
  const nombreCliente = venta.cliente || "Consumidor Final";
  const vendedor = venta.user?.name || "Staff SnowConnect";
  
  const productoModelo = venta.producto?.modelo || "Equipo";
  const productoMarca = venta.producto?.marca || "";
  const productoAlmacenamiento = venta.producto?.almacenamiento || "";
  const productoImei = venta.producto?.imei || "N/A";
  const precio = Number(venta.precioVenta || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>SNOW<Text style={{ color: '#3b82f6' }}>CONNECT</Text></Text>
            <Text style={styles.logoSubtext}>Equipos Premium Certificados</Text>
            <Text style={{ fontSize: 8, marginTop: 8, color: '#6b7280' }}>RNC: 132-XXXXX-X</Text>
            <Text style={{ fontSize: 8, color: '#6b7280' }}>Santiago de los Caballeros, RD</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.label}>RECIBO DE VENTA</Text>
            <Text style={styles.value}>#{idVenta}</Text>
            
            <Text style={styles.label}>FECHA</Text>
            <Text style={styles.value}>
              {format(fecha, "dd/MM/yyyy", { locale: es })}
            </Text>
          </View>
        </View>

        {/* DATOS CLIENTE */}
        <View style={styles.section}>
          <Text style={styles.label}>CLIENTE:</Text>
          <Text style={{ fontSize: 12, fontFamily: 'Helvetica' }}>{nombreCliente}</Text>
        </View>

        {/* TABLA */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.colDesc, { fontWeight: 'bold', color: '#4b5563' }]}>PRODUCTO</Text>
            <Text style={[styles.colIMEI, { fontWeight: 'bold', color: '#4b5563' }]}>SERIAL / IMEI</Text>
            <Text style={[styles.colPrice, { fontWeight: 'bold', color: '#4b5563' }]}>PRECIO</Text>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={{ fontWeight: 'bold' }}>{productoMarca} {productoModelo}</Text>
              <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>
                 {productoAlmacenamiento} • Grado A+
              </Text>
            </View>
            <Text style={styles.colIMEI}>{productoImei}</Text>
            <Text style={styles.colPrice}>RD$ {precio.toLocaleString()}</Text>
          </View>
        </View>

        {/* TOTALES */}
        <View style={styles.totalSection}>
          <View style={styles.totalContainer}>
             <View style={styles.totalRow}>
               <Text style={styles.totalLabel}>Subtotal</Text>
               <Text style={{ fontSize: 10 }}>RD$ {precio.toLocaleString()}</Text>
             </View>
             <View style={[styles.totalRow, { borderBottomWidth: 0 }]}>
               <Text style={[styles.totalLabel, { color: '#000' }]}>TOTAL PAGADO</Text>
               <Text style={styles.totalValue}>RD$ {precio.toLocaleString()}</Text>
             </View>
          </View>
        </View>

        {/* GARANTÍA */}
        <View style={styles.warranty}>
          <Text style={styles.warrantyTitle}>⚖️ TÉRMINOS Y GARANTÍA (30 DÍAS)</Text>
          <Text style={styles.warrantyText}>
            1. La garantía cubre defectos de fábrica en hardware (placa, sensores, cámaras) por 30 días calendario.
            {"\n"}2. NO cubre: Pantallas rotas, daños por líquidos, humedad, golpes, sobrecargas eléctricas o manipulación por terceros.
            {"\n"}3. Equipos mojados o con sellos de garantía rotos pierden la cobertura automáticamente.
            {"\n"}4. No hay devolución de dinero; se realizará cambio por un equipo de igual valor o nota de crédito.
            {"\n"}5. Para validar la garantía es OBLIGATORIO presentar este recibo.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Atendido por: {vendedor}</Text>
          <Text style={{ marginTop: 4 }}>¡Gracias por preferirnos!</Text>
          <Text style={{ marginTop: 2 }}>www.snowconnect.com • @snowconnect_rd</Text>
        </View>
      </Page>
    </Document>
  );
};