import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD } from '@env';

const App = () => {
  const [server, setServer] = useState(SQL_SERVER);
  const [database, setDatabase] = useState(SQL_DATABASE);
  const [user, setUser] = useState(SQL_USER);
  const [password, setPassword] = useState(SQL_PASSWORD);
  const [sqlPort, setSqlPort] = useState(''); // Pode adicionar a porta no .env se necessário
  const [connectionStatus, setConnectionStatus] = useState('');

  const handleConnect = async () => {
    const url = `http://${server}:3000/connect?server=${server}&database=${database}&user=${user}&password=${password}&sqlPort=${sqlPort}`;
    try {
      console.log('Tentando conectar ao servidor com a URL:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const message = await response.text();
      setConnectionStatus(message);
      console.log('Conexão bem-sucedida:', message);
    } catch (error) {
      console.error('Erro ao tentar conectar ao servidor:', error);
      setConnectionStatus('Falha na conexão com o servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Configurar Conexão ao SQL Server</Text>
      <TextInput
        style={styles.input}
        placeholder="Servidor SQL"
        value={server}
        onChangeText={setServer}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome da Base de Dados"
        value={database}
        onChangeText={setDatabase}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={user}
        onChangeText={setUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Porta do SQL Server"
        value={sqlPort}
        onChangeText={setSqlPort}
        keyboardType="numeric"
      />
      <Button title="Conectar" onPress={handleConnect} />
      {connectionStatus ? <Text>{connectionStatus}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default App;
