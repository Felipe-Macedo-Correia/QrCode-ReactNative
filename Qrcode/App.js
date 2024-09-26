import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const QrCodeScanner = () => {
  const [qrData, setQrData] = React.useState(null);

  // Função chamada ao ler o QR code
  const onSuccess = async (e) => {
    setQrData(e.data); // Salva os dados lidos

    // Enviar o QR code lido para o backend
    try {
      const response = await axios.post('https://sua-api-url.com/salvar-dados', {
        qrData: e.data, // Envia o dado do QR code para a API
      });
      
      // Exibe um alerta de sucesso ao usuário
      Alert.alert('Sucesso', 'Dados salvos com sucesso no banco!');
      console.log('Dados enviados com sucesso:', response.data);
    } catch (error) {
      // Exibe um alerta de erro ao usuário
      Alert.alert('Erro', 'Erro ao salvar os dados.');
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <View style={styles.container}>
      {qrData ? (
        <View>
          <Text style={styles.text}>QR Code lido com sucesso!</Text>
          <Text style={styles.qrData}>{qrData}</Text>
        </View>
      ) : (
        <QRCodeScanner
          onRead={onSuccess}  // Chama onSuccess quando o QR code for lido
          flashMode={RNCamera.Constants.FlashMode.auto}  // Flash no modo automático
          topContent={
            <Text style={styles.text}>Posicione o QR code no centro da câmera.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrData: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});

export default QrCodeScanner;
