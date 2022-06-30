import api from "./src/services/api"
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, Alert, Modal } from 'react-native';
import Element from './src/model/element'

export default function App() {

  const [visible, setVisible] = useState(false);

  const [elementValue, setElementValue] = useState<Element>();

  const [element, setElement] = useState<Element[]>([]);
  const [newElement, setNewElement] = useState('');

  useEffect(() => {
    getElements();
  }, []);

  //get
  async function getElements() {
    try {
      const { data } = await api.get("/elements");
      setElement(data);
    } catch (error) {
      alert('Erro ao buscar elementos')
      console.error(error)
    }
  }

  //creat
  async function creatElement() {
    try {
      Keyboard.dismiss();
      if (newElement == '') {
        setNewElement('')
        Alert.alert('Atenção!', "É necessário informar um nome.");
        return;
      }
      if (element.length != 0) {
        let i = 0
        while (1) {
          if (element[i].name == newElement) {
            setNewElement('')
            Alert.alert('Atenção!', "Este elemento ja existe");
            return;
          }
          if (element[i + 1] === undefined) {
            i = 0;
            break;
          }
          i++
        }
      }
      var elementCreat: Element = {
        name: newElement
      }
      setNewElement('')
      await api.post('/elements', elementCreat)
      return getElements();
    } catch (error) {
      alert('Erro ao inserir um novo elemento')
      console.error(error)
    }
  }

  //delete
  function deleteElement(item: Element) {
    Alert.alert('Atenção!', 'Deseja mesmo apagar o elemento?', [
      {
        text: 'Não',
        onPress: () => { return }
      },
      {
        text: 'sim',
        onPress() { confirmDelete(item) }
      }
    ])
  }
  async function confirmDelete(item: Element) {
    await api.delete('/elements/' + item.id);
    return getElements();
  }

  //edit
  async function editElement() {
    try {
      if (newElement == '') {
        setVisible(false)
        setNewElement('')
        Alert.alert('Atenção!', "É necessário informar um nome.");
        return;
      }
      var i = 0
      while (1) {
        if (element[i].name == newElement) {
          setVisible(false)
          setNewElement('')
          Alert.alert('Atenção!', "Este elemento ja existe");
          return;
        }
        if (element[i + 1] === undefined) {
          i = 0;
          break;
        }
        i++
      }
      var elementEdit: Element = {
        name: newElement
      }
      setNewElement('')
      setVisible(false)
      await api.put('/elements/' + elementValue.id, elementEdit)
      return getElements();
    } catch (error) {
      alert('Erro ao editar um elemento')
      console.error(error)
    }
  }

  return (
    <>

      <View style={styles.container}>

        <View style={styles.boby}>

          <FlatList
            style={styles.flatList}
            data={element}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <>
                <View style={styles.containerView}>
                  <Text style={styles.texto}>{item.name}</Text>
                  <View style={styles.buttons}>
                    {/* Modal */}
                    <View>
                      <Modal
                        animationType="fade"
                        visible={visible}
                      >
                        <TextInput
                          style={styles.inputModal}
                          placeholderTextColor='#999'
                          placeholder='update element'
                          maxLength={15}
                          onChangeText={text => setNewElement(text)}
                          value={newElement}

                        />
                        <View style={styles.buttons}>
                          {/* botao editar */}
                          <TouchableOpacity style={styles.buttonEditModal} onPress={() => editElement()}><Text style={styles.edit}>%</Text></TouchableOpacity>
                          {/* botao sair modal */}
                          <TouchableOpacity style={styles.buttonDelModal} onPress={() => { setNewElement(''), setVisible(false) }}><Text style={styles.del}>X</Text></TouchableOpacity>
                        </View>
                      </Modal>
                    </View>
                    {/* botao abrir modal */}
                    <TouchableOpacity style={styles.buttonEdit} onPress={() => { setElementValue(item), setVisible(true) }}><Text style={styles.edit}>%</Text></TouchableOpacity>
                    {/* botao X */}
                    <TouchableOpacity style={styles.buttonDel} onPress={() => deleteElement(item)}><Text style={styles.del}>X</Text></TouchableOpacity>
                  </View>
                </View>


              </>
            )}

          />
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholderTextColor='#999'
            placeholder='add element'
            maxLength={15}
            onChangeText={text => setNewElement(text)}
            value={newElement}
          />
          {/* Botao + */}
          <TouchableOpacity style={styles.buttonMore} onPress={() => creatElement()}><Text style={styles.more}>+</Text></TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  boby: {
    flex: 1,
  },
  form: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputModal: {
    padding: 0,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 13,
    
    borderColor: '#eee',
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  buttonMore: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10,
  },
  more: {
    color: "#fff",
    fontSize: 30,
  },
  flatList: {
    flex: 1,
    marginTop: 5,
  },
  containerView: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: '#eee',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#eee',
  },
  texto: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  buttonDel: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c76659',
    borderRadius: 4,
    marginLeft: 10,
  },
  buttonDelModal: {
    height: 50,
    width: 205,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c76659',
    borderRadius: 4,
    
  },
  del: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonEdit: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    marginLeft: 10,
  },
  buttonEditModal: {
    height: 50,
    width: 205,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c6cce',
    borderRadius: 4,
    
  },
  edit: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});
