import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const Settings = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50 p-5">
      <StyledView className="flex-1">
        <StyledText className="text-2xl font-bold text-gray-800 mb-8">
          Settings
        </StyledText>

        {/* Logout Button */}
        <StyledPressable
          className="bg-red-500 py-4 px-6 rounded-2xl items-center active:opacity-80"
          onPress={handleLogout}
        >
          <StyledText className="text-white font-semibold text-base">
            Logout
          </StyledText>
        </StyledPressable>
      </StyledView>
    </SafeAreaView>
  );
};

export default Settings;
