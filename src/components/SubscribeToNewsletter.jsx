"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react"; // Import useState for managing email input

const SubscribeToNewsletter = () => {
    const [name, setName] = useState(""); // State to manage name input
    const [email, setEmail] = useState(""); // State to manage email input

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh
        // Handle newsletter subscription logic here
        console.log(
            `Subscribing ${name} with email ${email} to the newsletter!`
        );
        setName(""); // Reset name input after submission
        setEmail(""); // Reset email input after submission
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Subscribe to Our Newsletter</CardTitle>
                <CardDescription>
                    Stay updated with the latest trends and exclusive offers.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        setName("");
                        setEmail("");
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit" form="subscribe-form">
                    Subscribe
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SubscribeToNewsletter;
