import React from "react";
import { View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];

const addHabit = () => {
  return (
    <View>
      <TextInput label="title" mode="outlined" />
      <TextInput label="description" mode="outlined" />
      <View>
        <SegmentedButtons
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>
      <Button>Add Habit</Button>
    </View>
  );
};

export default addHabit;
