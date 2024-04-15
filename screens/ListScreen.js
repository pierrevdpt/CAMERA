import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import useList from '../components/useList';
import { Text } from '../components/Text';
import colors from '../constants/couleurs';
import { useRoute } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ListScreen({ navigation }) {
    const route = useRoute();
    const { site, api } = route.params;


    useFocusEffect(() => {
        console.log("list : useFocusEffect")

    });

    function TabBarIcon(props) {
        const { name, color } = props;
      
        return <FontAwesome size={16} style={{ marginBottom: -3 }} name={name} color={color} />;
    }
     
    const { data, isLoading, isSuccess, refetch } = useList(site, api);

    return (
        <View style={styles.container}>
            {isLoading && (
                <React.Fragment>
                    <Text>Loading...</Text>
                </React.Fragment>
            )}

            {isSuccess && (
                <React.Fragment>
                    <FlatList
                        data={data}
                        style={styles.wrapper}
                        keyExtractor={(item) => `${item.qrcode}`}
                        renderItem={({ item }) => (

                                <Pressable
                                style={styles.post}
                                onPress={() => { {refetch(); navigation.navigate('Options', {item: item,api: api })} }}
                                >
                                  <View style={styles.item}>
                                    <Text style={[styles.postTitle, item.status === 'SCANNED' ? styles.scannedText : null]}>
                                        {item.rest_home_name}
                                    </Text>
                                    {item.bacAdded === 1 && (
                                        <TabBarIcon name="refresh" color={colors.white} />
                                    )}
                                    <Text style={[styles.postTitle, item.status === 'SCANNED' ? styles.scannedText : null]}>
                                        {item.prodtype === 'TPM' ? item.logistic_tag : null}
                                    </Text>
                                  </View>
                                </Pressable>

                        )}
                    />
                    
                </React.Fragment>
            )}
            
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 10
    },
    wrapper: {
        flex: 1,
        paddingVertical: 30
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontSize: 30,
        color: colors.primary,
        paddingVertical: 5
    },
    post: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    postTitle: { color: colors.white, textTransform: 'capitalize' },
    scannedText: { color: colors.gold, textTransform: 'capitalize' },

});