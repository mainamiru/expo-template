import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleProp, View, ViewStyle } from "react-native";
import {
  HelperText,
  Text,
  TextInput,
  TextInputProps,
} from "react-native-paper";

export interface InputFieldProps<T extends FieldValues> extends Omit<
  TextInputProps,
  "value" | "onChangeText"
> {
  label: string;
  required?: boolean;
  helperText?: string;
  name: FieldPath<T>;
  control: Control<T>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function InputField<T extends FieldValues>({
  name,
  label,
  control,
  helperText,
  containerStyle,
  required = false,
  ...props
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : false,
      }}
      render={({ field, fieldState }) => (
        <View style={[{ gap: 5 }, containerStyle]}>
          <Text variant="labelLarge">
            {label} {required && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <TextInput
            {...props}
            mode="outlined"
            value={field.value}
            onBlur={field.onBlur}
            onChangeText={field.onChange}
            error={Boolean(fieldState.error)}
            outlineStyle={[{ borderRadius: 10 }, props.outlineStyle]}
          />

          {fieldState.error ? (
            <HelperText type="error" visible>
              {fieldState.error.message}
            </HelperText>
          ) : helperText ? (
            <HelperText type="info" visible>
              {helperText}
            </HelperText>
          ) : null}
        </View>
      )}
    />
  );
}
