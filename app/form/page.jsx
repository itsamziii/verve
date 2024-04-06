"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toBase64 } from "@/utils/base64";
import { Checkbox } from "@/components/ui/checkbox";

const FormPage = () => {
  const router = useRouter();

  const [imgFiles, setImgFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [isRequesting, setIsRequesting] = useState(true);
  const [projectId, setProjectId] = useState("test");

  const form = useForm({
    defaultValues: {
      name: "",
      creator: "Anonymous",
      theme: "",
      uploadImages: [],
    },
  });

  const addImgHandler = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const newImgFiles = [...imgFiles, file];
    setImgFiles(newImgFiles);

    form.setValue("uploadImages", newImgFiles);
  };

  const onCheck = (checked) => {
    setAgreed(checked);
  };

  const onClick = (event) => {
    setImgFiles(
      imgFiles.filter((file) => file.name !== event.currentTarget.id)
    );

    const _event = new Event("change");
    const element = document.getElementById("add-single-img");

    element.dispatchEvent(_event);
  };

  const onSubmit = async (values) => {
    setIsFormSubmitted(true);

    values.uploadImages = [...(await Promise.all(imgFiles.map(toBase64)))];

    const { data } = await axios({
      method: "post",
      url: "/api/generate",
      data: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.success) {
      setIsRequesting(false);
      return;
    } else {
      setProjectId(data.projectId);
      setIsFormSuccess(true);
      setIsRequesting(false);
    }
  };

  return (
    <section className="relative w-full bg-black flex flex-col items-center pt-40 h-screen">
      <Card className="mx-auto bg-black z-10 w-[100%] sm:w-[32%] rounded-none sm:rounded-xl outline-none">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="uploadImages"
                render={() => (
                  <FormItem className="text-center">
                    <FormLabel>
                      Upload your images here. To remove an image right click on
                      it
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-[0.5rem]">
                        {imgFiles.map((file, index) => (
                          <div
                            key={index}
                            id={file.name}
                            className="size-[100px] object-cover border border-solid rounded-xl flex flex-row flex-wrap justify-center items-center"
                            onClick={onClick}
                          >
                            <Image
                              key={index}
                              alt={`Image ${index + 1}`}
                              src={URL.createObjectURL(file)}
                              height={100}
                              width={100}
                              className="rounded-xl overflow-hidden object-cover"
                              onLoad={() => {
                                URL.revokeObjectURL(URL.createObjectURL(file));
                              }}
                            />
                          </div>
                        ))}
                        <Label
                          className="flex justify-center items-center text-2xl cursor-pointer size-[100px] border border-solid rounded-xl object-cover"
                          htmlFor="add-single-img"
                        >
                          +
                        </Label>
                        <Input
                          id="add-single-img"
                          className="opacity-0 h-[0] w-[0]"
                          type="file"
                          accept="image/*"
                          onChange={addImgHandler}
                          required
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Name of Website</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="Your website's name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creator"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Creator</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="caution"
                  render={() => (
                    <FormItem className="flex-1 py-5">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            required
                            onCheckedChange={onCheck}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            By submitting this form you agree to let us to store
                            your data.
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                id="submit"
                type="submit"
                className="w-[40%]"
                disabled={!agreed}
              >
                {isFormSubmitted ? <Loading /> : "Submit Information"}
              </Button>

              <AlertDialog open={isFormSubmitted}>
                <AlertDialogContent className="justify-center items-center text-center">
                  <AlertDialogTitle>
                    {isRequesting
                      ? "Please wait! This will take some time ..."
                      : isFormSuccess
                      ? "Success! Your website is ready!"
                      : "Error! Something went wrong"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isRequesting
                      ? "Your request is being processed, please sit tight and enjoy some coffee while we work on your request. ☕"
                      : isFormSuccess
                      ? "Your website is all set! You can now visit your website, download the code or play around with the playground. 🚀"
                      : "There was an error processing your request. Please reload the page and try again later."}
                  </AlertDialogDescription>
                  <div className="flex flex-wrap gap-3 justify-center items-center">
                    <AlertDialogAction
                      disabled={!isFormSuccess}
                      className="flex flex-row"
                    >
                      <a
                        target="_blank"
                        href={`/outputs/${projectId}/index.html`}
                      >
                        Visit Website
                      </a>
                    </AlertDialogAction>
                    <AlertDialogCancel
                      disabled={!isFormSuccess}
                      className="flex flex-row"
                      onClick={() => router.push(`/playground?id=${projectId}`)}
                    >
                      Playground
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={!isFormSuccess}
                      className="flex flex-row"
                      onClick={() =>
                        router.push(`/api/download?id=${projectId}`)
                      }
                    >
                      Donwload Code
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default FormPage;
