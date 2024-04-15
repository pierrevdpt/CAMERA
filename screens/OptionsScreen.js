import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios'; 
import { Text } from '../components/Text';
import colors from '../constants/couleurs';
import { useMutation, useQueryClient } from 'react-query';
import { useFocusEffect } from '@react-navigation/native';

export default function OptionsScreen({ navigation }) {

    const route = useRoute();
    let { item,  api } = route.params;
    console.log(`Options  ${item?.qrcode}  & ${api}`)

    useFocusEffect(
        React.useCallback(() => {
            console.log("Options - focus useFocusEffect")
          return () => {
            console.log("Options - perd le focus useFocusEffect")
         };
        }, [])
      );

    const data = item 
        ? [
            {
                id: 1,
                bt: "SCANNED",
            },
            {
                id: 2,
                bt: "NEW",
            },
            {
                id: 3,
                bt: "BAC PLEIN",
            },
            {
                id: 4,
                bt: "RePRINT",
            },
        ]
        : [
            {
                id: 5,
                bt: "ENVOYER VERS CHRONOS"
            },
        ]

    if (!item) {
      item = {
          rest_home_name: 'OPTIONS GLOBALES',
          qrcode: '0',
      };
    }
      
    const qrcode = item.qrcode
    const statut = item.status
    
    const queryClient = useQueryClient();
    
    const setStatus = async (data) => {
        if (data.id == 3) {
          await axios.get(`${api}/bacPlein?qrcode=${qrcode}`);
          return true
        } 
        if (data.id == 5) {
          await axios.get(`${api}/sendChronos`);
          return true
        }
          
        await axios.get(`${api}/setStatus?qrcode=${qrcode}&status=${data.bt}`);

        return true;
    };
    
    const mutation = useMutation((data) => setStatus(data), {
        onSuccess: () => {
            // Mettez à jour les données en cache après la mutation réussie
            queryClient.invalidateQueries('posts');
            // Revenir à l'écran précédent et vider item
            navigation.setParams({ qrcode: null });
            navigation.navigate('List');
        },
    });

    
    const handleItemClick = (data) => {
        mutation.mutate(data);
    };

    return (
        <React.Fragment>
            <Text style={styles.header}>{item?.rest_home_name} {item?.prodtype === 'TPM' ? item?.logistic_tag : null}</Text>
        
            <FlatList
                data={data}
                style={styles.wrapper}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleItemClick(item) }
                        style={styles.post}
                    >
                        <View style={styles.post}>
                            <Text style={[styles.postTitle, statut === 'SCANNED' && item.id == 1  ? styles.scannedText : null]}>
                                {item.bt}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </React.Fragment>
    )
};

const styles = StyleSheet.create({
    post: {
        backgroundColor: colors.primary, // Couleur de fond du bouton
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 30,
        borderRadius: 5, // Bordure arrondie
        alignItems: 'center',
    },
    postText: {
        color: '#fff', // Couleur du texte
        fontSize: 16,
        fontWeight: 'bold',
    },

    wrapper: {
        flex: 1,
        paddingVertical: 30
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    header: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontSize: 40,
        color: colors.primary,
        paddingVertical: 10
    },
    commentHeader: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontSize: 30,
        color: colors.primary,
        paddingVertical: 30
    },
    postTitle: { color: colors.white, textTransform: 'capitalize' },
    scannedText: { color: colors.gold, textTransform: 'capitalize' },
});