import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { app, db,  addDoc } from "./Hooks/firebase.config"
import { collection, query, where, updateDoc, doc, getDocs, getDoc } from 'firebase/firestore';

const AddEvent = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [id, setId] = useState('');

    const handleAddEvent = async() => {
        try {
            const event = {
              id: id,
              name: name,
              description: description,
              image: image,
              price: price
            };
            const docRef = await addDoc(collection(db, 'services'), event );
            console.log('Document written with ID: ', docRef.id);
            setId("");
            setName("");
            setDescription("");
            setImage("");
            setPrice("");
          } catch (e) {
            console.error('Error adding document: ', e);
          }
    };

    return (
        <View style={{ marginTop: 20 }}>
            <TextInput
                placeholder="Id"
                value={id}
                onChangeText={text => setId(text)}
            />
            <TextInput
                placeholder="Event Name"
                value={name}
                onChangeText={text => setName(text)}
            />
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={text => setDescription(text)}
            />
            <TextInput
                placeholder="Image URL"
                value={image}
                onChangeText={text => setImage(text)}
            />
            <TextInput
                placeholder="Price"
                value={price}
                onChangeText={text => setPrice(text)}
            />
            <TouchableOpacity onPress={handleAddEvent}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddEvent;
