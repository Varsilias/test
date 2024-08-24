import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { RadioGroup } from "@/Components/ui/radio-group";
import { Switch } from "@/Components/ui/switch";
import { useConfig } from "@/contexts/config-context";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import React, { useEffect, useRef, useState } from "react";
import ColorPicker from "./color-picker";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { toast } from "@/Components/ui/use-toast";
import { router, useForm } from "@inertiajs/react";
import { useWebsite } from "@/contexts/website-context";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { CircleX, Info } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";

export default function BannerLayout() {
    const [logo, setLogo] = useState(null);
    const [logoError, setLogoError] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const {
        // config,
        // saveState,
        handleEnableMinimize,
        handleFullWidth,
        handleShowCloseIcon,
        handleShowSettingsBtn,
        handleDisplayPosition,
        handlePrimaryTextColor,
        handlePrimaryBtnColor,
        handlePrimaryBtnBorderColor,
        handleBannerTitle,
        handleBannerDescription,
        handleMoreInfoBtnLabel,
        handleMoreInfoBtnLink,
        handleShowBannerIcon,
        handleLogo,
        handleSecondaryTextColor,
        handleSecondaryBtnColor,
        handleSecondaryBtnBorderColor,
        handleDeclineTextColor,
        handleDeclineBtnColor,
        handleDeclineBtnBorderColor,
        handlePrimaryBtnLabel,
        handleDeclineInfoBtnLabel,
        handleSecondaryBtnLabel,
    } = useConfig();

    const { processing, errors, post, put, delete: deleteImage } = useForm({});

    const { selectedWebsite } = useWebsite();

    useEffect(() => {
        handleShowCloseIcon(boooleanHelp(selectedWebsite?.showCloseIcon));
        handleFullWidth(boooleanHelp(selectedWebsite?.fullWidth));
        handleEnableMinimize(boooleanHelp(selectedWebsite?.enableMinimize));
        handleShowSettingsBtn(boooleanHelp(selectedWebsite?.showSettingsBtn));
        handlePrimaryTextColor(selectedWebsite?.primaryTextColor);
        handlePrimaryBtnColor(selectedWebsite?.primaryBtnColor);
        handlePrimaryBtnBorderColor(selectedWebsite?.primaryBtnBorderColor);
        handleDisplayPosition(selectedWebsite?.displayPosition);
        handleBannerTitle(selectedWebsite?.bannerTitle);
        handleBannerDescription(selectedWebsite?.bannerDescription);
        handleMoreInfoBtnLabel(selectedWebsite?.moreInfoBtnLabel);
        handleMoreInfoBtnLink(selectedWebsite?.moreInfoBtnLink);
        handleShowBannerIcon(
            selectedWebsite?.logo == ""
                ? false
                : boooleanHelp(selectedWebsite?.showBannerIcon)
        );
        handleLogo(selectedWebsite?.logo);
        handleSecondaryTextColor(selectedWebsite?.secondaryTextColor);
        handleSecondaryBtnColor(selectedWebsite?.secondaryBtnColor);
        handleSecondaryBtnBorderColor(selectedWebsite?.secondaryBtnBorderColor);
        handleDeclineTextColor(selectedWebsite?.declineTextColor);
        handleDeclineBtnColor(selectedWebsite?.declineBtnColor);
        handleDeclineBtnBorderColor(selectedWebsite?.declineBtnBorderColor);
        handlePrimaryBtnLabel(selectedWebsite?.primaryBtnLabel);
        handleDeclineInfoBtnLabel(selectedWebsite?.declineInfoBtnLabel);
        handleSecondaryBtnLabel(selectedWebsite?.secondaryBtnLabel);
    }, [selectedWebsite]);

    const { config, saveState } = useConfig();

    function boooleanHelp(val) {
        if (val == 1 || val == true) {
            return true;
        } else if (val == 0 || val == false) {
            return false;
        }
    }

    function onSubmit(e) {
        e.preventDefault();

        const dataToSend = {
            ...saveState,
            logo: undefined,
            website_id: selectedWebsite.id,
        };

        post(route("configurations.update", dataToSend), {
            preserveScroll: true,
            onSuccess: (resp) => {
                toast({
                    description: "Configurations saved",
                });
            },
            onError: (errors) => {
                console.error(errors);
                toast({
                    description: errors.error,
                });
            },
        });
        handleClearImage();
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > (1 / 2) * 1024 * 1024) {
                setLogoError("File size exceeds 512Kb");
                setLogo(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setLogoError("");
                setLogo(file);
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewUrl(reader.result);
                    handleLogo(reader.result);

                    router.post(
                        "/websites/logo",
                        {
                            _method: "put",
                            domainId: selectedWebsite.domain_id,
                            logo: reader.result,
                        },
                        {
                            preserveScroll: true,
                            onSuccess: (resp) => {
                                toast({
                                    description: "Logo saved",
                                });
                            },
                            onError: (errors) => {
                                console.error(errors);
                                toast({
                                    description: errors.error,
                                });
                            },
                        }
                    );
                    handleClearImage();
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleClearImage = () => {
        setPreviewUrl(null);
        setLogoError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        handleLogo(selectedWebsite?.logo);
    };

    const handleDeleteLogo = () => {
        if (selectedWebsite?.id) {
            deleteImage(`/websites/${selectedWebsite?.id}/logo`, {
                preserveScroll: true,
                onSuccess: (resp) => {
                    toast({
                        description: "Logo deleted successfully.",
                    });
                },
                onError: (errors) => {
                    console.error(errors);
                    toast({
                        description: errors.error,
                    });
                },
            });
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Banner Layout</CardTitle>
                    <CardDescription>Select display position</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <RadioGroup
                        defaultValue={saveState.displayPosition}
                        className="flex flex-col"
                        onValueChange={handleDisplayPosition}
                    >
                        <div>
                            <RadioGroupItem
                                value="top"
                                id="top"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="top"
                                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                Top
                            </Label>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <RadioGroupItem
                                    value="left"
                                    id="left"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="left"
                                    className="flex flex-col cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    Left
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="right"
                                    id="right"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="right"
                                    className="flex flex-col items-center cursor-pointer justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    Right
                                </Label>
                            </div>
                        </div>
                        <div>
                            <RadioGroupItem
                                value="bottom"
                                id="bottom"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="bottom"
                                className="flex flex-col items-center cursor-pointer justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                Bottom
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    {/* <CardTitle>Banner Layout</CardTitle> */}
                    <CardDescription>Set display preference</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex w-full justify-between">
                        <Label className="text-xs">Show cookies overview</Label>
                        <Switch
                            checked={config.showSettingsBtn}
                            onCheckedChange={handleShowSettingsBtn}
                        />
                    </div>
                    <div className="flex w-full justify-between">
                        <Label className="text-xs">Show close icon</Label>
                        <Switch
                            checked={saveState.showCloseIcon}
                            onCheckedChange={handleShowCloseIcon}
                        />
                    </div>
                    <div className="flex w-full justify-between">
                        <Label className="text-xs">Show logo</Label>
                        <Switch
                            disabled={saveState.logo == "" ? true : false}
                            checked={saveState.showBannerIcon}
                            onCheckedChange={handleShowBannerIcon}
                        />
                    </div>
                    {(config.displayPosition == 'top' || config.displayPosition == 'bottom') && <div className="flex w-full justify-between">
                        <Label className="text-xs flex gap-2">
                            Show full width{" "}
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Info className="w-4 h-4 cursor-pointer" />
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <p>
                                        Full width banner popup works only when
                                        display position is set to top/bottom
                                    </p>
                                </HoverCardContent>
                            </HoverCard>
                        </Label>
                        <Switch
                            checked={config.fullWidth}
                            onCheckedChange={handleFullWidth}
                        />
                    </div>}
                    {/* <div className="flex w-full justify-between">
                        <Label className="text-xs">Enable minimize</Label>
                        <Switch
                            checked={config.enableMinimize}
                            onCheckedChange={handleEnableMinimize}
                        />
                    </div> */}
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    <CardDescription>
                        Banner logo:{" "}
                        <span className="text-xs text-black">
                            (1Mb max size)
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {selectedWebsite?.logo && (
                        <div className="flex">
                            <img
                                src={selectedWebsite?.logo}
                                alt="Logo Preview"
                                style={{
                                    maxWidth: "150px",
                                    maxHeight: "50px",
                                }}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleX
                                        className="h-4 w-4 text-red-500 cursor-pointer"
                                        onClick={handleDeleteLogo}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete logo</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                    <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        ref={fileInputRef}
                    />
                    {logoError && (
                        <span className="text-sm text-red-400">
                            {logoError}
                        </span>
                    )}
                    {previewUrl && (
                        <div className="flex">
                            <img
                                src={previewUrl}
                                alt="Logo Preview"
                                style={{
                                    maxWidth: "150px",
                                    maxHeight: "100px",
                                }}
                            />
                            <CircleX
                                className="h-4 w-4 text-red-500 cursor-pointer"
                                onClick={handleClearImage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Banner texts</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div>
                        <Label className="text-xs">Banner title</Label>
                        <Input
                            placeholder="Add banner text here."
                            defaultValue={saveState.bannerTitle}
                            onChange={(e) => handleBannerTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">More info label</Label>
                        <Input
                            placeholder="More info label"
                            defaultValue={saveState.moreInfoBtnLabel}
                            onChange={(e) =>
                                handleMoreInfoBtnLabel(e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Label className="text-xs">More info link</Label>
                        <Input
                            placeholder="More info link"
                            defaultValue={saveState.moreInfoBtnLink}
                            onChange={(e) =>
                                handleMoreInfoBtnLink(e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Banner description</Label>
                        <Textarea
                            placeholder="Add banner text here."
                            defaultValue={saveState.bannerDescription}
                            rows={7}
                            onChange={(e) =>
                                handleBannerDescription(e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    <CardDescription>Primary button settings</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Text color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.primaryTextColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="primaryColor"
                                    handler={handlePrimaryTextColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Background color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.primaryBtnColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="primaryColor"
                                    handler={handlePrimaryBtnColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Border color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.primaryBtnBorderColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="primaryColor"
                                    handler={handlePrimaryBtnBorderColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label className="text-xs">Text</Label>
                        <Input
                            placeholder="Add primary button text here."
                            defaultValue={saveState.primaryBtnLabel}
                            onChange={(e) =>
                                handlePrimaryBtnLabel(e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    <CardDescription>Secondary button settings</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Text color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.secondaryTextColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="secondaryColor"
                                    handler={handleSecondaryTextColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Background color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.secondaryBtnColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="secondaryColor"
                                    handler={handleSecondaryBtnColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Border color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-10 h-10 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.secondaryBtnBorderColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="secondaryColor"
                                    handler={handleSecondaryBtnBorderColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label className="text-xs">Text</Label>
                        <Input
                            placeholder="Add secondary button text here."
                            defaultValue={saveState.secondaryBtnLabel}
                            onChange={(e) =>
                                handleSecondaryBtnLabel(e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    <CardDescription>Reject button settings</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Text color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-9 h-9 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.declineTextColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="rejectColor"
                                    handler={handleDeclineTextColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Background color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-9 h-9 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.declineBtnColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="rejectColor"
                                    handler={handleDeclineBtnColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-xs">Border color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-9 h-9 rounded-full`}
                                    style={{
                                        backgroundColor: `var(--primary-color, ${config.themeSettings.declineBtnBorderColor})`,
                                    }}
                                ></Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-0">
                                <ColorPicker
                                    for="rejectColor"
                                    handler={handleDeclineBtnBorderColor}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label className="text-xs">Text</Label>
                        <Input
                            placeholder="Add reject button text here."
                            defaultValue={saveState.declineInfoBtnLabel}
                            onChange={(e) =>
                                handleDeclineInfoBtnLabel(e.target.value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
            <form onSubmit={onSubmit} className="pt-5">
                <Button disabled={processing}>Save settings</Button>
            </form>
        </div>
    );
}
