import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  MD2Colors,
  Card,
  Text,
  Button,
  Snackbar,
} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {evaluacionService} from '../../services/evaService';
import {useIsFocused} from '@react-navigation/native';
import {Dayjs} from 'dayjs';

const getEvaluciones = async token => {
  const evaluaciones = await evaluacionService.getEvaluaciones(token);
  return evaluaciones;
};

export function EvaluacionEst({navigation, route}) {
  const [eva, setEva] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [seachMessage, setSearchMessage] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const isFocused = useIsFocused();
  const {user} = route.params;

  useEffect(() => {
    setIsLoading(true);
    getEvaluciones(user).then(response => {
      setEva(response.data);
      setSearchMessage(response.message);
      setVisible(true);
      setIsLoading(false);

      setTimeout(() => {
        setVisible(false);
      }, 3000);
    });
  }, [isFocused]);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={{flexDirection: 'column', height: '100%', gap: 15}}>
      {isLoading ? (
        <>
          <Text>Cargando...</Text>
          <ActivityIndicator animating={true} color={MD2Colors.red_500} />
        </>
      ) : (
        <>
          {eva.map(e => {
            return (
              <Card
                key={e.id_evaluacion}
                style={
                  !!e.nota
                    ? (e.nota >= 7 
                        ? {backgroundColor: '#E8F5E9'}
                        : {backgroundColor: '#FBE9E7'}
                      )
                    : {backgroundColor: '#FAFAFA'}
                }>
                <Card.Title title={e.nombre + ' - ' + e.materia} />
                <Card.Content>
                  <Text>Tipo: {e.tipo}</Text>
                  <Text>Fecha: {e.fecha_realizacion}</Text>
                  <Text>Lugar: {e.lugar}</Text>
                  <Text>Ciclo: {e.ciclo}</Text>
                  {e.asistencia && (
                    <Text>Asistencia: {e.asistencia ? 'Si' : 'No'}</Text>
                  )}
                  {e.nota && <Text>Nota: {e.nota}</Text>}
                  {e.es_diferido && <Text>Diferido</Text>}
                  {e.es_repetido && <Text>Repetido</Text>}
                </Card.Content>
                <Card.Actions>
                  {e?.puede_diferir && (
                    <Button
                      onPress={() => {
                        console.log('Diferir' + `${e.id_evaluacion}`);
                      }}>
                      Diferir
                    </Button>
                  )}
                  {e?.puede_repetir && (
                    <Button
                      onPress={() => {
                        console.log('Repetir' + `${e.id_evaluacion}`);
                      }}>
                      Repetir
                    </Button>
                  )}
                </Card.Actions>
              </Card>
            );
          })}
        </>
      )}

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
        }}>
        {seachMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
