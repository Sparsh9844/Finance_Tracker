"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Switch } from "@/components/ui/switch";
import { accountSchema } from "@/lib/schema";
import { createAccount } from "@/actions/dashboard";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setLoading(true);
      await createAccount(values);
      toast.success("Account created successfully!");
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new account.
          </DrawerDescription>
        </DrawerHeader>

        <form className="px-4 pb-4 space-y-4" onSubmit={onSubmit}>
          {/* Account Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Account Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Account Type
            </label>
            <Select
              onValueChange={(value) => setValue("type", value)}
              value={watch("type")}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CURRENT">Current</SelectItem>
                <SelectItem value="SAVINGS">Savings</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <label htmlFor="balance" className="text-sm font-medium">
              Starting Balance
            </label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("balance")}
            />
            {errors.balance && (
              <p className="text-sm text-red-600">{errors.balance.message}</p>
            )}
          </div>

          {/* Is Default */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={watch("isDefault")}
              onCheckedChange={(checked) => setValue("isDefault", checked)}
            />
            <label htmlFor="isDefault" className="text-sm">
              Set as default account
            </label>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
