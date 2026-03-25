"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/accounts";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const [switchChecked, setSwitchChecked] = useState(isDefault);

  const handleDefaultChange = async (checked) => {
    if (isDefault && !checked) {
      toast.warning("You need at least 1 default account");
      return;
    }

    setSwitchChecked(checked); // optimistically update UI
    await updateDefaultFn(id);
  };

  // Show toast on successful update
  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success(`${name} set as default account`);
    }
  }, [updatedAccount, name]);

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <Switch
            checked={switchChecked}
            onCheckedChange={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
