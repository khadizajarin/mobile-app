import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (name && email && message) {
      Alert.alert('Message Sent', 'Thank you for contacting us!');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      Alert.alert('Error', 'Please fill out all fields.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.infoText}>
        For any inquiries or feedback, please contact us using the information below or fill out the contact form.
      </Text>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactHeader}>Event Management Office</Text>
        <Text style={styles.contactDetail}>123 Event Street</Text>
        <Text style={styles.contactDetail}>City, State, ZIP</Text>
        <Text style={styles.contactDetail}>Phone: (123) 456-7890</Text>
        <Text style={styles.contactDetail}>Email: info@eventmanagement.com</Text>
      </View>

      <Text style={styles.formHeader}>Send Us a Message</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Message</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Your Message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
      />
      <TouchableOpacity onPress={handleSend} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Contact;

const styles = StyleSheet.create({

  button: {
    marginTop:10,
    backgroundColor: '#3A3D42',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactInfo: {
    marginBottom: 30,
  },
  contactHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactDetail: {
    fontSize: 16,
    marginBottom: 2,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});
