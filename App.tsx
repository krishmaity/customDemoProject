import React, { useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

interface CustomTextInputProps extends TextInputProps { }

const CustomTextInput: React.FC<CustomTextInputProps> = ({ }) => {
  const [amount, setAmount] = useState<string>('');
  const [tempValue, setTempValue] = useState<string>('');
  const [history, setHistory] = useState<string[]>(['']);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // this function used for on Change input value
  const _onChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    setTempValue(numericText);
    setAmount(numericText);
    setWarningMsg(null);
  };

  // its function used for blur input  
  const _onInputBlur = () => {
    const newValue = parseFloat(tempValue) || 0;
    const lastValue = parseFloat(history[currentIndex]) || 0;
    if (newValue < lastValue) {
      setWarningMsg("The current value is lower than the previous value.")
    }
    if (tempValue && (history[currentIndex] !== tempValue)) {
      const newHistory = history.slice(0, currentIndex + 1);
      setHistory([...newHistory, tempValue]);
      setCurrentIndex(newHistory.length);
    }
  };

  // this function used for undo button
  const onPressUndo = () => {
    if (currentIndex > 0) {
      const newUndoData = currentIndex - 1;
      setCurrentIndex(newUndoData);
      setAmount(history[newUndoData]);
      setWarningMsg(null);
    }
  };

  // for redo button this function uesd
  const onPressRedo = () => {
    if (currentIndex < history.length - 1) {
      const newRedoData = currentIndex + 1;
      setCurrentIndex(newRedoData);
      setAmount(history[newRedoData]);
      setWarningMsg(null);
    }
  };

  // this function used for copy button
  const _onPressCopy = () => {
    Clipboard.setString(amount);

  }

  // here is paste Button function 
  const _onPressPaste = async () => {
    const pasteData = await Clipboard.getString();
    if (/^[0-9.]*$/.test(pasteData)) {
      setAmount(pasteData);
      setTempValue(pasteData);
    }
  }

  // here Header design implement
  const headerSec = () => {
    return (
      <View style={{ height: 50, backgroundColor: "#3f5da8", justifyContent: 'center' }}>
        <View style={{ marginHorizontal: '5%' }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: '600' }}>Custom Text Input</Text>
        </View>
      </View>
    )
  }

  // text input field  design implement here
  const inputSec = () => {
    return (
      <View>
        <Text style={styles.amountText}>Amount</Text>
        <RNTextInput
          value={amount}
          onChangeText={_onChangeText}
          onBlur={_onInputBlur}
          placeholder={"$0.00"}
          placeholderTextColor={"gray"}
          keyboardType="numeric"
          style={styles.inputStyle}
        />
        {warningMsg && (<Text style={styles.warningText}>{warningMsg}</Text>)}
      </View>
    )
  }

  // All button design implement here 
  const buttonSec = () => {
    return (
      <React.Fragment>
        <View style={styles.buttonMainViewStyle}>
          <TouchableOpacity style={styles.buttonView} onPress={onPressUndo} activeOpacity={0.9}>
            <Text style={styles.textStyle}>Undo</Text>
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity style={styles.buttonView} onPress={onPressRedo} activeOpacity={0.9}>
            <Text style={styles.textStyle}>Redo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonMainViewStyle}>
          <TouchableOpacity style={styles.buttonView} onPress={_onPressCopy} activeOpacity={0.9}>
            <Text style={styles.textStyle}>Copy</Text>
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity style={styles.buttonView} onPress={_onPressPaste} activeOpacity={0.9}>
            <Text style={styles.textStyle}>Paste</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    )
  }

  // here main return call
  return (
    <SafeAreaView style={styles.container}>
      {headerSec()}
      <View style={{ marginHorizontal: '5%', marginTop: 60 }}>
        {inputSec()}
        {buttonSec()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  amountText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500"
  },

  inputStyle: {
    fontSize: 18,
    padding: 5,
    height: 50,
    borderColor: "#000",
    borderRadius: 12,
    borderWidth: 0.9,
    marginTop: 10,
    color: '#000'
  },

  warningText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },

  buttonMainViewStyle: {
    marginTop: 20,
    flexDirection: 'row',
  },

  buttonView: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f5da8',
    padding: 5,
    borderRadius: 22,
    flex: 0.5,
  },

  textStyle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomTextInput;