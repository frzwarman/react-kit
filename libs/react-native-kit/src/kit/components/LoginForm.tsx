import { useState } from 'react';
import { VStack } from '../../gluestack/vstack';
import { HStack } from '../../gluestack/hstack';
import { Input } from '../../gluestack/input';
import { InputField } from '../../gluestack/input';
import { Button } from '../../gluestack/button';
import { ButtonText } from '../../gluestack/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '../../gluestack/form-control';
import { Spinner } from '../../gluestack/spinner';

export interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
  onError,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const handleSubmit = async () => {
    // Validate inputs
    if (!username.trim()) {
      setLocalError('Username is required');
      onError?.('Username is required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      onError?.('Password is required');
      return;
    }

    setLocalError(null);

    try {
      await onSubmit({ username, password });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setLocalError(errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <VStack space="lg" className="w-full px-6">
      {/* Username Field */}
      <FormControl isInvalid={!!displayError}>
        <FormControlLabel>
          <FormControlLabelText className="text-base font-semibold">
            Username
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="lg"
          className="rounded-lg"
          isDisabled={isLoading}
        >
          <InputField
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Input>
      </FormControl>

      {/* Password Field */}
      <FormControl isInvalid={!!displayError}>
        <FormControlLabel>
          <FormControlLabelText className="text-base font-semibold">
            Password
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="lg"
          className="rounded-lg"
          isDisabled={isLoading}
        >
          <InputField
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            secureTextEntry
          />
        </Input>
      </FormControl>

      {/* Error Message */}
      {displayError && (
        <FormControl isInvalid>
          <FormControlError>
            <FormControlErrorText className="text-red-600">
              {displayError}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}

      {/* Login Button */}
      <Button
        size="lg"
        className="rounded-lg bg-blue-600 mt-4"
        onPress={handleSubmit}
        isDisabled={isLoading || !username.trim() || !password.trim()}
      >
        {isLoading ? (
          <HStack space="sm">
            <Spinner size="small" color="white" />
            <ButtonText>Logging in...</ButtonText>
          </HStack>
        ) : (
          <ButtonText>Login</ButtonText>
        )}
      </Button>
    </VStack>
  );
};
