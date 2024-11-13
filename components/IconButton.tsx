import { StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress?: () => void;
};

export default function IconButton({ icon, onPress }: Props) {
    return (
        <Pressable
            style={styles.button}
            onPress={onPress}>
            <MaterialCommunityIcons name={icon} size={24} color="#fff" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
