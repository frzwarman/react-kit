import { View } from "react-native";
import { Button, ButtonText } from "../gluestack/button";

interface TabSwitcherProps {
  tabs: { label: string, value: string }[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View className="">
      {tabs.map((tab, index) => (
        <Button
          key={index}
          variant={activeTab === tab.value ? "solid" : "outline"}
          size="md"
          action="positive"
          onPress={() => onTabChange(tab.value)}
        >
          <ButtonText>{tab.label}</ButtonText>
        </Button>
      ))}
    </View>
  );
}