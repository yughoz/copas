// toastLib.js
import React from 'react'// replace with the actual toast provider or library you are using
import { Toast, ToastDescription, ToastTitle, useToast } from "@/components/ui/toast";

// Main function to show the toast
export const showNewToast = (toast, message = "Permission denied to access clipboard", title = "Error!") => {
    const newId = Math.random()
    // const toast = useToast()
    toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
            const uniqueToastId = "toast-" + id
            return (
                <Toast nativeID={uniqueToastId} action="error" variant="solid">
                    <ToastTitle>{title}</ToastTitle>
                    <ToastDescription>
                        {message}
                    </ToastDescription>
                </Toast>
            )
        },
    })
}
