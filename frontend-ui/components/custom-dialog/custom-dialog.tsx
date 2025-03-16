'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {useMediaQuery} from "@/src/hooks/use-media-query";

interface CustomDialogProps {
    trigger: React.ReactNode;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function CustomDialog({ trigger, title, description, children, footer }: CustomDialogProps) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        isMobile ? (
            <Drawer>
                <DrawerTrigger asChild>
                    {trigger}
                </DrawerTrigger>
                <DrawerContent className="px-7 mb-[calc(var(--mobile-tab-bar-height)-1px)]">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    </DrawerHeader>
                    {children}
                    {footer && (
                        <DrawerFooter>
                            {footer}
                        </DrawerFooter>
                    )}
                </DrawerContent>
            </Drawer>
        ) : (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                {footer && (
                <DialogFooter>
                    {footer}
                </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
        )
    );
}