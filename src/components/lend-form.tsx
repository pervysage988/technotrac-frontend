"use client";

import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  formulateLendRequest,
  FormulateLendRequestInput,
} from "@/ai/flows/formulate-lend-request";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createEquipment } from "@/lib/api/equipment";

//
// ✅ Schema + type definition
//
const formSchema = z.object({
  model: z.string().min(2, { message: "Model name is required." }),
  brand: z.string().min(2, { message: "Brand is required." }),
  type: z.string().min(1, { message: "Please select an equipment type." }),
  description: z.string().optional(),
  hourly_rate: z
    .number()
    .min(0, { message: "Rate must be a positive number." })
    .optional(),
  daily_rate: z
    .number()
    .min(1, { message: "Daily rate is required and must be positive." }),
  operator_included: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

export function LendForm() {
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formulatedDescription, setFormulatedDescription] = useState<
    string | null
  >(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  //
  // ✅ Correctly typed useForm
  //
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      brand: "",
      model: "",
      daily_rate: 1,
      hourly_rate: undefined,
      operator_included: false,
      description: "",
    },
  });

  //
  // ✅ Generate description
  //
  const onGenerateDescription: SubmitHandler<FormSchema> = async (values) => {
    startGeneratingTransition(async () => {
      setFormulatedDescription(null);
      try {
        const equipmentDetails = `Equipment: ${values.brand} ${values.model} (${values.type}). Rate: ₹${values.daily_rate}/day.`;

        // ✅ Matches schema now
        const input: FormulateLendRequestInput = {
          ownerId: user?.uid ?? "temp-owner",
          equipmentType: values.type,
          availabilityDates: "Flexible", // placeholder until you add calendar UI
          additionalDetails: values.description,
          pastLendingHistory:
            "Owner with a good track record of lending equipment.",
          currentEquipmentAvailability: equipmentDetails,
          requestCharacteristics:
            "Generate a compelling and professional description for a new equipment listing.",
        };

        const result = await formulateLendRequest(input);

        setFormulatedDescription(result.formulatedRequest);
        form.setValue("description", result.formulatedRequest);
      } catch (e: unknown) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to generate description. Please try again.",
        });
      }
    });
  };

  //
  // ✅ Final submit with correct typing
  //
  const onFinalSubmit: SubmitHandler<FormSchema> = async (values) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to list equipment.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await user.getIdToken();

      await createEquipment(
        {
          ...values,
          image_url: "https://picsum.photos/400/300", // placeholder
          lat: 30.901,
          lon: 75.8573,
        },
        token
      );

      toast({
        title: "Success!",
        description:
          "Your equipment has been listed and is pending admin approval.",
      });
      router.push("/profile");
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Something went wrong";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errMsg,
      });
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          List New Equipment
        </CardTitle>
        <CardDescription>
          Fill in the details of your equipment. Use the AI generator to create
          a compelling description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinalSubmit)}
            className="space-y-6"
          >
            {/* TODO: Add actual form fields here later */}

            <Button
              type="button"
              onClick={form.handleSubmit(onGenerateDescription)}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Generate Description with AI"
              )}
            </Button>

            {formulatedDescription && (
              <p className="text-sm text-muted-foreground border rounded-md p-2">
                Suggested description: {formulatedDescription}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isGenerating}
              className="w-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save and List Equipment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
