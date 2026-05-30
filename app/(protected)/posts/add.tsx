import { queryClient } from "@/client";
import { InputField } from "@/components";
import { PostCreateModel } from "@/db/types/post";
import { createPost } from "@/services";
import { postCreateSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@mainamiru/react-native-ui";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Button, Card } from "react-native-paper";

const AddPost = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      userId: 1,
      title: "",
      content: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: PostCreateModel) => {
      return await createPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
    onError: (error) => {
      console.log("Error: ", error);
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data).catch((error) => {
      console.log("Error: ", error);
    });
  });

  return (
    <Container processing={isPending}>
      <KeyboardAwareScrollView>
        <Card style={{ margin: 16 }}>
          <Card.Content style={{ gap: 12 }}>
            <InputField
              required
              name="title"
              label="Title"
              control={control}
              placeholder="Enter title"
            />
            <InputField
              required
              multiline
              name="content"
              label="Content"
              control={control}
              placeholder="Enter content"
              style={{ height: 120 }}
            />
            <Button loading={isPending} mode="contained" onPress={onSubmit}>
              Submit
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default AddPost;
