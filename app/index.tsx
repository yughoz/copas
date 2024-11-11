import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { VStack } from "@/components/ui/vstack";
import { addCopas } from "@/lib/Store";
const index = () => {
  return (
    <SafeAreaView className="md:flex flex-col items-center justify-center md:w-full h-full">
      <VStack className="p-2 md:max-w-[440px] w-full" space="xl">
        <Button
          onPress={async () => {
            const sort_id = await addCopas();
            console.log("sort_id", sort_id);
            // router.push("/"+sort_id);
          }}
        >
          <ButtonText>Copy Paste</ButtonText>
        </Button>
        <Button
          className="w-full"
          onPress={() => {
            router.push("auth/signin");
          }}
        >
          <ButtonText>Sign in</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("auth/signup");
          }}
        >
          <ButtonText>Sign up</ButtonText>
        </Button>
        {/* <Button
          onPress={() => {
            router.push("auth/forgot-password");
          }}
        >
          <ButtonText>Forgot password</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("auth/create-password");
          }}
        >
          <ButtonText>Create password</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("news-feed/news-and-feed");
          }}
        >
          <ButtonText>News feed</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("dashboard/dashboard-layout");
          }}
        >
          <ButtonText>Dashboard</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("profile/profile");
          }}
        >
          <ButtonText>Profile</ButtonText>
        </Button> */}
      </VStack>
    </SafeAreaView>
  );
};

export default index;
