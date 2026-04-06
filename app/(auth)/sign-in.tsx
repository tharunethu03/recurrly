import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/");
    } else if (signIn.status === "needs_second_factor") {
      // Handle MFA if needed
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/");
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <StyledScrollView className="flex-1 bg-amber-50">
        <StyledView className="flex-1 justify-center items-center min-h-full py-5 px-5">
          {/* Logo and Branding */}
          <StyledView className="flex-row items-center mb-15 gap-3">
            <StyledView className="w-15 h-15 rounded-2xl bg-accent justify-center items-center">
              <StyledText className="text-3xl font-bold text-white">
                R
              </StyledText>
            </StyledView>
            <StyledView>
              <StyledText className="text-2xl font-bold text-gray-800">
                Recurly
              </StyledText>
              <StyledText className="text-xs text-gray-600 font-medium mt-0.5">
                SMART BILLING
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Card */}
          <StyledView className="w-full bg-white rounded-3xl p-6 shadow-sm">
            <StyledText className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Verify your account
            </StyledText>
            <StyledText className="text-sm text-gray-600 text-center mb-6 leading-5">
              Enter the verification code sent to your email
            </StyledText>

            <StyledView className="mb-6">
              <StyledView className="mb-5">
                <StyledText className="text-sm font-semibold text-gray-800 mb-2">
                  Verification Code
                </StyledText>
                <StyledTextInput
                  className="border border-amber-200 rounded-2xl py-3.5 px-4 text-base bg-amber-50 text-gray-800"
                  value={code}
                  placeholder="Enter code"
                  placeholderTextColor="#999999"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="numeric"
                  editable={fetchStatus !== "fetching"}
                />
                {errors.fields.code && (
                  <StyledText className="text-red-500 text-xs mt-1">
                    {errors.fields.code.message}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>

            <StyledPressable
              className={`bg-accent py-4 px-6 rounded-2xl items-center mb-5 ${
                fetchStatus === "fetching" ? "opacity-60" : ""
              } active:opacity-90`}
              onPress={handleVerify}
              disabled={fetchStatus === "fetching"}
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <StyledText className="text-white font-semibold text-base">
                  Verify
                </StyledText>
              )}
            </StyledPressable>

            <StyledPressable
              className="py-3 px-6 rounded-2xl items-center mb-3 active:opacity-70"
              onPress={() => signIn.mfa.sendEmailCode()}
            >
              <StyledText className="text-accent font-semibold text-sm">
                I need a new code
              </StyledText>
            </StyledPressable>

            <StyledPressable
              className="py-3 px-6 rounded-2xl items-center active:opacity-70"
              onPress={() => signIn.reset()}
            >
              <StyledText className="text-accent font-semibold text-sm">
                Start over
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    );
  }

  return (
    <StyledScrollView className="flex-1 bg-amber-50">
      <StyledView className="flex-1 justify-center items-center min-h-full py-5 px-5">
        {/* Logo and Branding */}
        <StyledView className="flex-row items-center mb-15 gap-3">
          <StyledView className="w-15 h-15 rounded-2xl bg-accent justify-center items-center">
            <StyledText className="text-3xl font-bold text-white">R</StyledText>
          </StyledView>
          <StyledView>
            <StyledText className="text-2xl font-bold text-gray-800">
              Recurly
            </StyledText>
            <StyledText className="text-xs text-gray-600 font-medium mt-0.5">
              SMART BILLING
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Card */}
        <StyledView className="w-full bg-white rounded-3xl p-6 shadow-sm">
          {/* Header */}
          <StyledText className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Welcome back
          </StyledText>
          <StyledText className="text-sm text-gray-600 text-center mb-6 leading-5">
            Sign in to continue managing your subscriptions
          </StyledText>

          {/* Form */}
          <StyledView className="mb-6">
            <StyledView className="mb-5">
              <StyledText className="text-sm font-semibold text-gray-800 mb-2">
                Email
              </StyledText>
              <StyledTextInput
                className="border border-amber-200 rounded-2xl py-3.5 px-4 text-base bg-amber-50 text-gray-800"
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#999999"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                keyboardType="email-address"
                editable={fetchStatus !== "fetching"}
              />
              {errors.fields.identifier && (
                <StyledText className="text-red-500 text-xs mt-1">
                  {errors.fields.identifier.message}
                </StyledText>
              )}
            </StyledView>

            <StyledView className="mb-5">
              <StyledText className="text-sm font-semibold text-gray-800 mb-2">
                Password
              </StyledText>
              <StyledTextInput
                className="border border-amber-200 rounded-2xl py-3.5 px-4 text-base bg-amber-50 text-gray-800"
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#999999"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                editable={fetchStatus !== "fetching"}
              />
              {errors.fields.password && (
                <StyledText className="text-red-500 text-xs mt-1">
                  {errors.fields.password.message}
                </StyledText>
              )}
            </StyledView>
          </StyledView>

          {/* Button */}
          <StyledPressable
            className={`bg-accent py-4 px-6 rounded-2xl items-center mb-5 ${
              !emailAddress || !password || fetchStatus === "fetching"
                ? "opacity-60"
                : ""
            } active:opacity-90`}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <StyledText className="text-white font-semibold text-base">
                Sign in
              </StyledText>
            )}
          </StyledPressable>

          {/* Sign Up Link */}
          <StyledView className="flex-row justify-center items-center">
            <StyledText className="text-sm text-gray-600">
              New to Recurly?{" "}
            </StyledText>
            <Link href="/(auth)/sign-up">
              <StyledText className="text-sm text-accent font-semibold">
                Create an account
              </StyledText>
            </Link>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}
