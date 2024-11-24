import { View, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress?: () => void;
};

export default function IconButton({ icon, onPress }: Props) {
    return (
        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
            <Pressable
                style={styles.button}
                onPress={onPress}>
                <MaterialCommunityIcons name={icon} size={60} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
