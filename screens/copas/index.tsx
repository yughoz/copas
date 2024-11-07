import { VStack } from "@/components/ui/vstack";
import { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { AddIcon, Icon } from "@/components/ui/icon";
import {
    GluestackIcon,
    GluestackIconDark,
} from "./assets/icons/gluestack-icon";
import { useColorScheme } from "nativewind";

import useRouter from "@unitools/router";
import { AuthLayout } from "../auth/layout";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon, EyeIcon, Copy, Send, DeleteIcon } from "lucide-react-native";
import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";
import { Divider } from "@/components/ui/divider";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { FormControl, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Grid, GridItem } from "@/components/ui/grid";
import { useLocalSearchParams } from "expo-router";
import {  useStore , addDataCopas } from "@/lib/Store";

const SplashScreenWithLeftBackground = () => {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const toast = useToast()
    const [text, setText] = useState('');
    const inputRef = useRef(null);
    const [toastId, setToastId] = useState(0);
    const [arrCopy, setArrCopy] = useState([]);
    const { sort_id } = useLocalSearchParams();
    const { copasData } = useStore({ sort_id })
    const copyToClipboard = (item:string) => {
        Clipboard.setStringAsync(item);
        toast.show({
            placement: "top",
            render: ({ id }) => {
                const toastId = "toast-" + id
                return (
                    <Toast
                    nativeID={toastId}
                    action= "success"
                    className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
                    >
                    {/* Send is imported from 'lucide-react-native' */}
                    <Icon
                        as={Copy}
                        size="xl"
                        className="fill-typography-100 stroke-none"
                    />
                    <Divider
                        orientation="vertical"
                        className="h-[30px] bg-outline-200"
                    />
                    <ToastTitle size="sm">Copying to clipboard</ToastTitle>
                    </Toast>
                )
            },
        })
    };

    const addData = () => {
        if (text.length > 10000) {
            toast.show({
                id: Math.random(),
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                    const uniqueToastId = "toast-" + id
                    return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid">
                        <ToastTitle>Error!</ToastTitle>
                        <ToastDescription>
                        Text exceeds the maximum length of 10000 characters
                        </ToastDescription>
                    </Toast>
                    )
                },
            });
        } else if (text === ''){
            toast.show({
                id: Math.random(),
                placement: "top",
                duration: 3000,
                render: ({ id }) => {
                    const uniqueToastId = "toast-" + id
                    return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid">
                        <ToastTitle>Error!</ToastTitle>
                        <ToastDescription>
                        Please input text to copy
                        </ToastDescription>
                    </Toast>
                    )
                },
            });
        } else {
            if (arrCopy.length > 2) {
                arrCopy.pop(); // Remove the first element
            }
            setArrCopy([text, ...arrCopy]);
            addDataCopas(sort_id, [text, ...arrCopy]);
            setText('');
            inputRef.current.focus();
        }
    }

    const removeData = (data_new) => {
        addDataCopas(sort_id, data_new);
    }


    useEffect(() => {
        setArrCopy(copasData);
    }, [copasData]);

    useEffect(() => {
        // if (error) throw error;
        // console.log('sort_id index', sort_id);

    }, [sort_id]);

    const renderList = () => {
        const temp = copasData.map((item, index) => {
            return (
                <Grid key={index} className="gap-5"
                _extra={{
                  className: "grid-cols-8",
                }}>
                    <GridItem
                        className="p-3 rounded-md text-center"
                        _extra={{
                            className: "col-span-5",
                        }}
                    >
                        <Textarea className="text-center" 
                                ref={inputRef}
                                size="sm"
                                isDisabled={true}>
                            <TextareaInput 
                            
                                type= "text"
                                value={item}
                                
                            />
                        </Textarea>

                    </GridItem>
                    <GridItem
                        className="p-3 rounded-md text-center"
                        _extra={{
                            className: "col-span-3",
                        }}
                    >
                        <ButtonGroup className="pb-3">
                            <Button 
                                size="xs" variant="solid" action="positive"
                                onPress={() => {
                                    copyToClipboard(item);
                                }}>
                                <ButtonText className="font-medium">Copy</ButtonText>
                                {/* <ButtonSpinner /> */}
                                <ButtonIcon as={Copy} />
                                </Button>
                        </ButtonGroup>
                        <ButtonGroup space="xl" >
                            <Button 
                                size="xs" variant="solid" action="negative"
                                onPress={() => {
                                    removeData(arrCopy.filter((_, i) => i !== index))
                                    setArrCopy(arrCopy.filter((_, i) => i !== index));
                                }}>
                                <ButtonText className="font-medium">Remove</ButtonText>
                                {/* <ButtonSpinner /> */}
                                <ButtonIcon as={DeleteIcon} />
                                </Button>
                        </ButtonGroup>
                    </GridItem>

                
                </Grid>
            )
        });

        return temp;

       return null
    }
    
    return (
        <VStack
            className="w-full max-w-[440px] items-center h-full justify-center"
            space="lg"
        >
            {colorScheme === "dark" ? (
                <Icon as={GluestackIconDark} className="w-[219px] h-10" />
            ) : (
                // <Icon as={GluestackIcon} className="w-[219px] h-10" />
                <VStack space="xs">
                    <Text className="text-center text-3xl font-bold">Copas (Copy Paste)</Text>
                    <Text className="text-center text">Open this link on another device:  : {window.location.href}</Text>
                    {/* <Text className="text-center text">In Another gadget</Text> */}
                    {/* <Text className="text-center text-xl">Your id : {sort_id}</Text> */}
                </VStack>
            )}
            <VStack className="w-full" space="lg">
                <VStack space="xs">
                <FormControl size="sm">
                    <FormControlLabel>
                        <FormControlLabelText>Type what you want to Copy and Paste.</FormControlLabelText>
                    </FormControlLabel>
                    {/* <Text className="text-typography-500 leading-1">Type what you want to Copy and Paste.</Text> */}
                    <Textarea className="text-center" 
                            ref={inputRef}
                            isFocused={true}>
                        <TextareaInput 
                            type= "text"
                            value={text}
                            onChangeText={(newText) => setText(newText)}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                                    addData();
                                }
                            }}
                        />
                    </Textarea>
                    <FormControlHelper>
                        <FormControlHelperText>Shift and Enter add new line</FormControlHelperText>
                    </FormControlHelper>
                    <ButtonGroup>
                        <Button 
                            size="xs" variant="solid" action="positive"
                            onPress={() => {
                                addData();
                            }}>
                            <ButtonText className="font-medium">Add Data</ButtonText>
                            {/* <ButtonSpinner /> */}
                            <ButtonIcon as={AddIcon} />
                            </Button>
                    </ButtonGroup>
                    {/* <Button
                        size="xs" variant="solid" action="positive"
                        onPress={() => {
                            addData();
                        }}
                        >
                        
                    </Button> */}
                        {/* <InputSlot className="pr-5" onPress={addData}>
                            <InputIcon
                                as={AddIcon}
                                
                                className="text-darkBlue-500"
                            />
                        </InputSlot> */}
                </FormControl>
                </VStack>
                
                {renderList()}

                <Button
                    onPress={() => {
                        router.push("/");
                    }}
                    >
                    <ButtonText className="font-medium">Home</ButtonText>
                </Button>
                {/* <Button
                    className="w-full"
                    onPress={() => {
                        router.push("/auth/signin");
                    }}
                    >
                    <ButtonText className="font-medium">Log in</ButtonText>
                </Button> */}
                {/* <Button
                    onPress={() => {
                        router.push("/auth/signup");
                    }}
                    >
                    <ButtonText className="font-medium">Sign Up</ButtonText>
                </Button> */}
            </VStack>
        </VStack>
    );
};

export const SplashScreen = () => {
    return (
        <AuthLayout>
        <SplashScreenWithLeftBackground />
        </AuthLayout>
    );
};
