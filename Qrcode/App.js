import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [scannedType, setScannedType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScannedData(data);
    setScannedType(type);
    setLoading(true);

    const payload = { type, data };
    console.log('Dados sendo enviados:', payload);

    try {
      const response = await fetch('http://172.20.10.2:8000/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json(); 
      console.log('Resposta como texto:', result);

        if (response.ok) {
          Alert.alert('Sucesso!', 'Dados salvos com sucesso.');
        } else {
          Alert.alert('Erro!', result.error || 'Erro ao salvar os dados.');
        }
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {loading && <Text style={styles.loadingText}>Salvando dados...</Text>}
      {scannedData && (
        <View style={styles.overlay}>
          <Text style={styles.qrText}>Dados do QR Code: {scannedType} - {scannedData}</Text>
          <Button title="Limpar" onPress={() => setScannedData(null)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    color: 'white',
    fontSize: 20,
    margin: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    position: 'absolute',
    bottom: 50,
  },
});

export default QRCodeScanner;
