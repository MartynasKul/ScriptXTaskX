import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export const CustomButton = ({ title, onPress, color = "#CCCCFF", disabled }: CustomButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8} 
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    margin:5,
    borderRadius:12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    minWidth: 150,
    alignItems: "center",
  },
  buttonText:{
    color: "#0A0AAF",
    fontSize: 16,
    fontWeight: "600",
  },
});